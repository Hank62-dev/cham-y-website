import type { Request, Response } from 'express';
import { z } from 'zod';
import { Visitor } from '../models/visitor.model.js';
import { VisitDaily } from '../models/visit-daily.model.js';
import { ok } from '../utils/api.js';

const visitorSchema = z.object({ visitorId: z.string().min(16).max(120) });

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function heartbeat(req: Request, res: Response) {
  const { visitorId } = visitorSchema.parse(req.body);
  await Visitor.findOneAndUpdate(
    { visitorId },
    { $set: { lastSeen: new Date() }, $setOnInsert: { firstSeen: new Date() } },
    { upsert: true, new: true },
  );
  await VisitDaily.findOneAndUpdate(
    { date: today() },
    { $addToSet: { visitorIds: visitorId }, $inc: { visits: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return ok(res, { received: true });
}

export async function analyticsSummary(_req: Request, res: Response) {
  const onlineSince = new Date(Date.now() - 5 * 60 * 1000);
  const [totalVisitors, onlineVisitors, daily] = await Promise.all([
    Visitor.countDocuments(),
    Visitor.countDocuments({ lastSeen: { $gte: onlineSince } }),
    VisitDaily.find().sort({ date: -1 }).limit(30).lean(),
  ]);
  return ok(res, {
    totalVisitors,
    onlineVisitors,
    daily: daily.reverse().map((item) => ({ date: item.date, visitors: item.visitorIds.length, visits: item.visits })),
  });
}

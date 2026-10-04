import { useEffect, useMemo, useState } from 'react';
import { Activity, LogOut, RefreshCw, Users } from 'lucide-react';
import { getAnalytics } from './api';

const REFRESH_INTERVAL = 3 * 60 * 1000;

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function Analytics({ token, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  async function load(silent = false) {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const result = await getAnalytics(token);
      setData(result.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
    const interval = window.setInterval(() => load(true), REFRESH_INTERVAL);
    return () => window.clearInterval(interval);
  }, [token]);

  const history = useMemo(() => {
    const dailyMap = new Map((data?.daily || []).map((item) => [item.date, item.visitors]));
    const today = new Date();
    const days = [];
    for (let offset = -14; offset <= 15; offset += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      const key = dateKey(date);
      days.push({ key, visitors: offset > 0 ? 0 : (dailyMap.get(key) || 0), future: offset > 0 });
    }
    return days;
  }, [data]);

  const max = Math.max(1, ...history.map((item) => item.visitors));
  const level = (visitors) => visitors === 0 ? 0 : Math.min(4, Math.ceil((visitors / max) * 4));

  return <div className="admin-shell analytics-page-shell">
    <header className="admin-top"><div className="brand">CHẠM Ý <small>TRAFFIC ANALYTICS</small></div><button className="logout" onClick={onLogout}><LogOut size={14} /> Đăng xuất</button></header>
    <main className="admin-main analytics-page">
      <div className="admin-heading"><div><p className="eyebrow">TRUY CẬP HỆ THỐNG</p><h1>Lượng truy cập</h1></div><button className="analytics-refresh" type="button" onClick={() => load()} disabled={loading || refreshing}><RefreshCw size={14} className={refreshing ? 'is-spinning' : ''} /> {refreshing ? 'Đang cập nhật...' : 'Làm mới'}</button></div>
      {error && <div className="error">{error}</div>}
      {loading ? <div className="analytics-loading"><span className="admin-spinner" /> Đang tải thống kê...</div> : <>
        <div className="analytics-stats"><article><div><span>Tổng số người truy cập</span><strong>{data?.totalVisitors || 0}</strong></div><Users /></article><article><div><span>Đang online</span><strong>{data?.onlineVisitors || 0}</strong></div><Activity /></article></div>
        <section className="analytics-card analytics-history-card">
          <div className="analytics-card-heading"><div><p className="eyebrow">LỊCH SỬ TRUY CẬP</p><h2>Lượt truy cập theo ngày</h2></div><span>Tự cập nhật mỗi 3 phút</span></div>
          <div className="analytics-history" aria-label="Lịch sử lượt truy cập theo ngày">{history.map((item) => { const barHeight = item.visitors ? Math.max(8, (item.visitors / max) * 180) : 0; return <div className={`analytics-history-cell level-${level(item.visitors)} ${item.future ? 'is-future' : ''}`} key={item.key} data-tooltip={`${item.key} · ${item.visitors} người`}><div className="analytics-history-track" style={{ '--bar-height': `${barHeight}px` }}><strong>{item.visitors > 0 ? item.visitors : ''}</strong><span className="analytics-history-bar" style={{ height: `${barHeight}px` }} /></div><small>{item.key.slice(5).replace('-', '/')}</small></div>; })}</div>
          <div className="analytics-history-legend"><span>Ít hơn</span><i className="level-0" /><i className="level-1" /><i className="level-2" /><i className="level-3" /><i className="level-4" /><span>Nhiều hơn</span></div>
        </section>
      </>}
    </main>
  </div>;
}

export default Analytics;

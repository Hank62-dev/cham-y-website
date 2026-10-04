import { useEffect, useState } from 'react';
import { Activity, LogOut, RefreshCw, Users } from 'lucide-react';
import { getAnalytics } from './api';

function Analytics({ token, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  async function load() {
    setLoading(true); setError('');
    try { const result = await getAnalytics(token); setData(result.data); } catch (e) { setError(e.message); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  const daily = data?.daily || [];
  const max = Math.max(1, ...daily.map((item) => item.visitors));
  return <div className="admin-shell analytics-page-shell"><header className="admin-top"><div className="brand">CHẠM Ý <small>TRAFFIC ANALYTICS</small></div><button className="logout" onClick={onLogout}><LogOut size={14} /> Đăng xuất</button></header><main className="admin-main analytics-page"><div className="admin-heading"><div><p className="eyebrow">TRUY CẬP HỆ THỐNG</p><h1>Lượng truy cập</h1></div><button className="analytics-refresh" type="button" onClick={load} disabled={loading}><RefreshCw size={14} /> Làm mới</button></div>{error && <div className="error">{error}</div>}{loading ? <div className="analytics-loading"><span className="admin-spinner" /> Đang tải thống kê...</div> : <><div className="analytics-stats"><article><div><span>Tổng số người truy cập</span><strong>{data?.totalVisitors || 0}</strong></div><Users /></article><article><div><span>Đang online</span><strong>{data?.onlineVisitors || 0}</strong></div><Activity /></article></div><section className="analytics-card"><div className="analytics-card-heading"><div><p className="eyebrow">30 NGÀY GẦN NHẤT</p><h2>Lượt truy cập theo ngày</h2></div><span>Người truy cập duy nhất</span></div>{daily.length ? <div className="analytics-chart" aria-label="Biểu đồ lượt truy cập theo ngày">{daily.map((item) => <div className="analytics-bar-group" key={item.date}><div className="analytics-bar-value">{item.visitors}</div><div className="analytics-bar" style={{ height: `${Math.max(8, item.visitors / max * 180)}px` }} title={`${item.date}: ${item.visitors} người`} /><small>{item.date.slice(5).replace('-', '/')}</small></div>)}</div> : <div className="analytics-empty">Chưa có dữ liệu truy cập.</div>}</section></>}</main></div>;
}

export default Analytics;

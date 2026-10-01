import { ArrowRight, Check, Compass, Heart, Sparkles, WandSparkles } from 'lucide-react';
import { asset } from '../lib/assets';

function Guide({ go }) {
  const steps = [
    ['01', 'CHỌN', 'Chọn một concept có sẵn hoặc bắt đầu từ trang tự phối.'],
    ['02', 'PHỐI', 'Chọn màu dây, chữ cái, charm và cách sắp xếp bạn thích.'],
    ['03', 'XEM', 'Xem preview trực quan trước khi quyết định đặt hàng.'],
    ['04', 'GỬI', 'Gửi thông tin và ảnh preview để Chạm Ý xác nhận lại.'],
  ];

  return (
    <main className="page guide guide-premium">
      <section className="guide-hero">
        <div className="guide-hero-copy">
          <p className="eyebrow">HƯỚNG DẪN CHẠM Ý</p>
          <h1>Bạn nên bắt đầu<br /><em>từ đâu?</em></h1>
          <p>Không cần biết thiết kế. Chỉ cần một chút ý thích, Chạm Ý sẽ giúp bạn biến nó thành món phụ kiện thật riêng.</p>
          <div className="guide-hero-actions"><button className="primary" onClick={() => go?.('customize')}>Bắt đầu tự phối <ArrowRight size={17} /></button><span><Sparkles size={15} /> vui từ lựa chọn đầu tiên</span></div>
        </div>
        <div className="guide-hero-art"><img src={asset('logoChamY-removebg-preview.png')} alt="Logo Chạm Ý" /><span className="guide-art-tag"><WandSparkles size={14} /> made for you</span></div>
      </section>

      <section className="guide-choice">
        <div className="guide-section-heading"><p className="eyebrow">TWO WAYS TO START</p><h2>Chọn cách bắt đầu<br /><em>hợp với bạn.</em></h2></div>
        <div className="guide-choice-grid">
          <article className="guide-choice-card guide-choice-ready"><div className="guide-card-icon"><Compass size={25} /></div><p className="eyebrow">01 · NHANH GỌN</p><h3>Chọn concept có sẵn</h3><p>Những mẫu đã được phối sẵn màu, charm và tinh thần. Chọn mẫu bạn thích, nhập tên riêng và đặt ngay.</p><button className="text-button" onClick={() => go?.('shop')}>Xem concept <ArrowRight size={14} /></button></article>
          <article className="guide-choice-card guide-choice-custom"><div className="guide-card-icon"><WandSparkles size={25} /></div><p className="eyebrow">02 · THẬT RIÊNG</p><h3 style={{ color: '#fff' }}>Tự phối món của bạn</h3><p>Tự chọn từng chi tiết, xem preview trực quan và tạo ra một món đồ không giống bất kỳ ai.</p><button className="text-button" onClick={() => go?.('customize')}>Tự phối ngay <ArrowRight size={14} /></button></article>
        </div>
      </section>

      <section className="guide-process">
        <div className="guide-section-heading centered"><p className="eyebrow">THE CHẠM Ý FLOW</p><h2>Từ một ý thích<br /><em>đến món đồ của bạn.</em></h2><p>Chỉ vài bước nhỏ, nhưng mỗi bước đều có dấu ấn riêng của bạn.</p></div>
        <div className="steps guide-steps">{steps.map(([n, t, d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><i><Check size={13} /></i></article>)}</div>
      </section>

      <section className="order-guide guide-order-premium"><div className="guide-order-copy"><p className="eyebrow">SAU KHI BẠN ĐÃ CHỌN</p><h2>Đặt món thật dễ,<br /><em>Chạm Ý lo phần còn lại.</em></h2><p>Chúng mình sẽ kiểm tra lại thông tin, xác nhận đơn và hoàn thiện món phụ kiện theo lựa chọn của bạn.</p><div className="guide-trust"><span><Heart size={15} /> Làm thủ công</span><span><Check size={15} /> Xác nhận trước khi làm</span></div></div><ol>{['Gửi thông tin và ảnh preview.', 'Chạm Ý xác nhận lại đơn hàng.', 'Thanh toán theo hướng dẫn.', 'Hoàn thiện và giao sản phẩm.'].map((x, i) => <li key={x}><b>0{i + 1}</b><span>{x}</span></li>)}</ol></section>

      <section className="guide-diagram"><div><p className="eyebrow">NHÌN LÀ HIỂU</p><h2>Món móc khóa<br /><em>được tạo nên thế nào?</em></h2><p>Mỗi nhánh, mỗi charm và mỗi chữ đều có vị trí của nó. Xem sơ đồ để hình dung món đồ trước khi bắt tay vào phối.</p></div><img className="guide-image" src={asset('so-do-moc-khoa.svg')} alt="Sơ đồ mô phỏng móc khóa Chạm Ý" /></section>

      <section className="guide-final-cta"><p className="eyebrow">YOUR TURN</p><h2>Ý tưởng của bạn<br /><em>đã sẵn sàng chưa?</em></h2><button className="primary" onClick={() => go?.('customize')}>Tự phối ngay <ArrowRight size={17} /></button></section>
    </main>
  );
}

export default Guide;

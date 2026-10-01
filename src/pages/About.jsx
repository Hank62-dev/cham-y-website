import { ArrowRight, Heart, MoveRight, Sparkles, Star } from 'lucide-react';
import { asset } from '../lib/assets';
import '../styles/about.css';

function About({ go }) {
  const values = [
    ['01', 'Cá nhân hóa', 'Mỗi món đồ bắt đầu từ một sở thích rất riêng của bạn.'],
    ['02', 'Làm thủ công', 'Từng chi tiết nhỏ được chọn, xâu và hoàn thiện bằng sự tỉ mỉ.'],
    ['03', 'Có câu chuyện', 'Một món phụ kiện nhỏ, nhưng lưu lại một người, một ngày, một dấu ấn.'],
  ];

  return (
    <main className="page about about-premium">
      <section className="about-hero">
        <div className="about-hero-copy">
          <p className="eyebrow">CÂU CHUYỆN CHẠM Ý</p>
          <h1>Chạm vào những điều<br /><em>thuộc về riêng bạn.</em></h1>
          <p className="about-lead">Chạm Ý tạo ra những món phụ kiện nhỏ để bạn mang theo màu sắc, ký ức và cá tính của mình mỗi ngày.</p>
          <div className="about-hero-meta"><span><Sparkles size={15} /> handmade with love</span><span><Heart size={15} /> made for your story</span></div>
        </div>
        <div className="about-hero-art"><div className="about-orbit-label">YOUR VIBE<br /><b>YOUR KEY</b></div><img src={asset('logoChamY-removebg-preview.png')} alt="Logo Chạm Ý" /><span className="about-art-caption">CHẠM VÀO CÁ TÍNH</span></div>
      </section>

      <section className="about-manifesto">
        <div className="about-manifesto-mark">01 <span>THE IDEA</span></div>
        <div><p className="eyebrow">MỘT Ý TƯỞNG NHỎ</p><h2>“Chạm” là sự kết nối.<br /><em>“Ý” là ý thích, ý tưởng và dấu ấn cá nhân.</em></h2><p>Chúng mình tin rằng những điều thân thuộc nhất thường không cần phải thật lớn. Một màu sắc bạn yêu, một cái tên muốn giữ bên mình, hay một món đồ khiến bạn mỉm cười — tất cả đều có thể trở thành câu chuyện riêng.</p></div>
      </section>

      <section className="about-values"><div className="about-section-heading"><p className="eyebrow">ĐIỀU CHẠM Ý TIN</p><h2>Nhỏ xinh,<br /><em>nhưng có ý nghĩa.</em></h2></div><div className="about-value-grid">{values.map(([n, title, text]) => <article key={n}><span className="about-value-number">{n}</span><div className="about-value-icon">{n === '01' ? <Star size={23} /> : n === '02' ? <Sparkles size={23} /> : <Heart size={23} />}</div><h3>{title}</h3><p>{text}</p><MoveRight className="about-value-arrow" size={20} /></article>)}</div></section>

      <section className="about-process"><div className="about-process-head"><p className="eyebrow">FROM IDEA TO KEEPSAKE</p><h2>Một món đồ<br /><em>được tạo nên thế nào?</em></h2><p>Từ lựa chọn đầu tiên đến lúc hoàn thiện, Chạm Ý luôn đồng hành để món phụ kiện thật sự thuộc về bạn.</p></div><div className="about-process-list"><div><b>01</b><span>Chọn cảm hứng</span><small>Màu dây, charm và câu chuyện bạn muốn kể.</small></div><div><b>02</b><span>Phối theo ý bạn</span><small>Nhìn thấy trước từng chi tiết trong preview.</small></div><div><b>03</b><span>Chạm Ý hoàn thiện</span><small>Làm thủ công và xác nhận lại trước khi gửi.</small></div></div></section>

      <section className="about-quote-panel"><div className="about-quote-sign">“</div><blockquote>Không cần giống ai cả.<br /><em>Chỉ cần giống bạn.</em></blockquote><p>— Chạm Ý</p></section>

      <section className="about-final"><p className="eyebrow">SẴN SÀNG TẠO DẤU ẤN?</p><h2>Mang một chút<br /><em>cá tính theo bạn.</em></h2><button className="primary" onClick={() => go?.('customize')}>Tự phối món của bạn <ArrowRight size={16} /></button></section>
    </main>
  );
}

export default About;

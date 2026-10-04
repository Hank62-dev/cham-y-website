import { ArrowRight, Check, Clock, Flower2, Heart, MoveRight, Sparkles, WandSparkles } from 'lucide-react';
import Feature from '../components/common/Feature';
import ProductCard from '../components/common/ProductCard';
import { specialCharmsAssets, products } from '../data/siteData';
import { asset } from '../lib/assets';

function Home({ go }) {
  return (
    <main>
      <section className="hero home-hero">
        <div>
          <p className="eyebrow">HANDMADE • PERSONALIZED • MADE WITH LOVE</p>
          <h1>Chạm vào cá tính,<br /><em>Chạm Ý</em> cá nhân.</h1>
          <p className="lead">Tự chọn, tự phối và tạo nên món phụ kiện mang dấu ấn rất riêng của bạn.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => go('customize')}>Khám phá tự phối <ArrowRight size={17} /></button>
            <button className="secondary" onClick={() => go('shop')}>Xem concept <MoveRight size={16} /></button>
          </div>
          <div className="hero-proof"><span><Check size={13} /> Tự chọn từng chi tiết</span><span><Check size={13} /> Làm thủ công tại Chạm Ý</span></div>
        </div>
        <div className="hero-art"><div className="orbit">✦</div><div className="hero-card"><img src={asset('khung-thiet-ke.jpg')} /></div><span className="sticker">made<br />for you ♡</span><span className="hero-float-note">your idea<br /><b>your key</b></span></div>
      </section>

      <section className="opening-hours"><div className="opening-hours-icon"><Clock size={24} /></div><div><p className="eyebrow">CHẠM Ý ĐANG HOẠT ĐỘNG</p><h2>10:00 – 21:00</h2><p>Thứ 2 – Thứ 7 · Sẵn sàng tư vấn và nhận đơn của bạn.</p></div></section>

      <section className="intro home-intro">
        <div><p className="eyebrow">VỀ CHẠM Ý</p><h2>Tạo nên <em>cái riêng</em><br />của bạn.</h2></div>
        <div><p>Chạm Ý là thương hiệu móc khóa handmade cá nhân hóa, nơi bạn có thể tự chọn và phối charm, màu sắc, chữ và concept theo sở thích để tạo nên một món phụ kiện mang dấu ấn riêng.</p><button className="text-button" onClick={() => go('about')}>Câu chuyện Chạm Ý <ArrowRight size={14} /></button></div>
      </section>

      <section className="features home-features">
        <Feature icon={<Sparkles size={28} strokeWidth={1.8} />} title="Concept có sẵn" text="Những mẫu đã được Chạm Ý phối sẵn." />
        <Feature icon={<Flower2 size={28} strokeWidth={1.8} />} title="Tự phối" text="Tự chọn charm, màu sắc, chữ và cách phối." />
        <Feature icon={<Heart size={28} strokeWidth={1.8} />} title="Cá nhân hóa" text="Tạo sản phẩm theo sở thích của mình." />
        <Feature icon={<MoveRight size={28} strokeWidth={1.8} />} title="Đồng hành" text="Chạm Ý hướng dẫn trong quá trình lựa chọn." />
      </section>

      <section className="customizer-spotlight">
        <div className="spotlight-visual"><img src={asset('so-do-moc-khoa.svg')} alt="Sơ đồ mô phỏng món móc khóa tự phối" /><span className="spotlight-badge"><WandSparkles size={15} /> made by you</span></div>
        <div className="spotlight-copy"><p className="eyebrow">TỰ PHỐI NGAY</p><h2>Mỗi lựa chọn<br /><em>là một câu chuyện.</em></h2><p>Chọn màu dây, mix charm, thêm chữ cái và sắp xếp theo cách của riêng bạn. Không cần biết thiết kế — Chạm Ý đã chuẩn bị sẵn mọi thứ để bạn bắt đầu thật vui.</p><div className="spotlight-points"><span><Check size={15} /> Chọn charm yêu thích</span><span><Check size={15} /> Nhập tên riêng 2–5 chữ</span><span><Check size={15} /> Xem preview trước khi đặt</span></div><button className="primary" onClick={() => go('customize')}>Bắt đầu tự phối <ArrowRight size={17} /></button></div>
      </section>

      <section className="home-products">
        <div className="section-heading"><div><p className="eyebrow">CONCEPT CÓ SẴN</p><h2>Chọn một mood,<br /><em>chạm một cá tính.</em></h2></div><button className="text-button" onClick={() => go('shop')}>Xem tất cả concept <ArrowRight size={14} /></button></div>
        <div className="product-grid">{products.map((product) => <ProductCard product={product} go={go} key={product.id} />)}</div>
      </section>

      <section className="charm-marquee"><div className="marquee-copy"><p className="eyebrow">KHO CHARM</p><h2>Nhỏ xinh,<br /><em>nhiều lựa chọn.</em></h2><p>Một chút hoa, một chút màu, một chút lấp lánh — ghép lại thành món đồ chỉ thuộc về bạn.</p><button className="secondary" onClick={() => go('customize')}>Tự chọn charm <ArrowRight size={15} /></button></div><div className="charm-orbit-grid">{specialCharmsAssets.slice(0, 6).map((charm, index) => <div className={`charm-orbit-item charm-orbit-${index + 1}`} key={charm.id}><img src={charm.image} alt={charm.name} /><span>{charm.name}</span></div>)}</div></section>

      <section className="home-final-cta"><p className="eyebrow">READY WHEN YOU ARE</p><h2>Món đồ nhỏ,<br /><em>dấu ấn thật to.</em></h2><p>Bắt đầu từ một ý tưởng rất riêng của bạn.</p><button className="primary" onClick={() => go('customize')}>Tạo món của bạn <ArrowRight size={17} /></button></section>
    </main>
  );
}

export default Home;

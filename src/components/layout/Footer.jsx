import { ArrowUpRight, AtSign, MessageCircle, Phone } from 'lucide-react';
import { asset } from '../../lib/assets';

const contactLinks = {
  messenger: 'https://m.me/chamy.charm',
  instagram: 'https://ig.me/m/chamy.charm',
  phone: 'tel:+84936423989',
};

function Footer() {
  return (
    <footer>
      <div className="footer-brand">
        <img src={asset('logoChamY-cream.png')} alt="Logo Chạm Ý" />
        <div><strong>CHẠM Ý</strong><small>chạm vào cá tính</small></div>
      </div>

      <div className="footer-contact">
        <span className="footer-label">LIÊN HỆ VỚI CHẠM Ý</span>
        <a className="footer-phone" href={contactLinks.phone}>
          <Phone size={15} /> 0936 423 989
        </a>
        <p>Gọi hoặc nhắn tin để được tư vấn mẫu và đặt món riêng.</p>
        <div className="contact-actions">
          <a href={contactLinks.messenger} target="_blank" rel="noreferrer">
            <MessageCircle size={15} /> Messenger <ArrowUpRight size={13} />
          </a>
          <a href={contactLinks.instagram} target="_blank" rel="noreferrer">
            <AtSign size={15} /> Nhắn Instagram <ArrowUpRight size={13} />
          </a>
        </div>
      </div>

      <div className="footer-hours">
        <span className="footer-label">GIỜ HOẠT ĐỘNG</span>
        <strong>10:00 – 21:00</strong>
        <p>Thứ 2 – Thứ 7</p>
        <small>Chủ nhật: nghỉ nhận đơn</small>
      </div>

      <div className="footer-social">
        <span className="footer-label">KẾT NỐI VỚI CHẠM Ý</span>
        <div>
          <a href="https://www.facebook.com/share/1Ee6EpUt8b/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={13} /></a>
          <a href="https://www.instagram.com/chamy.charm?stkn=am9veHRpa3YyZGM0" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={13} /></a>
          <a href="https://www.threads.com/@chamy.charm?igshid=NTc4MTIwNjQ2YQ==" target="_blank" rel="noreferrer">Threads <ArrowUpRight size={13} /></a>
          <a href="https://www.tiktok.com/@chm08094?_r=1&_t=ZS-99us3xwzDx" target="_blank" rel="noreferrer">TikTok <ArrowUpRight size={13} /></a>
        </div>
      </div>

      <p className="footer-message">Những chiếc móc khóa handmade<br />được tạo nên từ ý tưởng của bạn.</p>
      <div className="footer-bottom">
        <span>© 2026 Chạm Ý. Handmade with love.</span>
        <span>chạm ý cá nhân • made for you</span>
      </div>
    </footer>
  );
}

export default Footer;

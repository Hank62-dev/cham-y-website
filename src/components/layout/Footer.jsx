import { asset } from '../../lib/assets';

function Footer() { return <footer><div className="footer-brand"><img src={asset('logoChamY.jpg')} /><div><strong>CHẠM Ý</strong><small>chạm vào cá tính</small></div></div><p className="footer-message">Những chiếc móc khóa handmade<br />được tạo nên từ ý tưởng của bạn.</p><div className="footer-social"><span>KẾT NỐI VỚI CHẠM Ý</span><div><a href="https://www.facebook.com/share/1Ee6EpUt8b/?mibextid=wwXIfr">Facebook ↗</a><a href="https://www.instagram.com/chamy.charm?stkn=am9veHRpa3YyZGM0">Instagram ↗</a><a href="https://www.threads.com/@chamy.charm?igshid=NTc4MTIwNjQ2YQ==">Threads ↗</a><a href="https://www.tiktok.com/@chm08094?_r=1&_t=ZS-99us3xwzDx">TikTok ↗</a></div></div><div className="footer-bottom"><span>© 2026 Chạm Ý. Handmade with love.</span><span>chạm ý cá nhân • made for you</span></div></footer>; }

export default Footer;


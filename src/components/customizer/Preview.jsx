import { charms } from '../../data/siteData';

function Preview({ selected, letters, previewRef, charmOptions = charms, cordColor = '#ff4d5d', arrangement = 'random', letterStyle = 'bubble' }) {
  const enteredLetters = (letters || '').replace(/\s/g, '').slice(0, 5).split('');
  const charmSlots = [0, 1, 2];
  const letterSlots = [0, 1, 2, 3, 4];
  const labelFont = "'DM Sans', 'Helvetica Neue', Arial, sans-serif";
  const charm = (index) => charmOptions.find((item) => item.id === selected[index]);

  return (
    <div ref={previewRef} className="live-preview diagram-preview" style={{ '--cord-color': cordColor }}>
      <svg className="preview-diagram-svg" viewBox="0 0 800 1000" role="img" aria-label="Mô phỏng móc khóa Chạm Ý">
        <defs>
          <radialGradient id="bubbleGradient" cx="30%" cy="20%" r="85%"><stop offset="0" stopColor="#ffb3d9" /><stop offset="0.65" stopColor="#e33fa9" /><stop offset="1" stopColor="#b92d82" /></radialGradient>
          <filter id="bubbleShadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#8c245f" floodOpacity=".3" /></filter>
        </defs>
        <rect width="800" height="1000" rx="36" fill="#f0e9dc" />
        <rect x="24" y="24" width="752" height="952" rx="30" fill="none" stroke="#d9cfbc" strokeWidth="2" />

        <text x="48" y="68" fontFamily={labelFont} fontSize="17" fontWeight="700" letterSpacing="2" fill="#3a5a35">MÓN CỦA BẠN</text>
        <text x="752" y="68" fontFamily={labelFont} fontSize="14" fontWeight="700" letterSpacing="2" fill="#d14fa5" textAnchor="end">LIVE PREVIEW</text>

        <path d="M434 140 H690 V815" fill="none" stroke={cordColor} strokeWidth="8" strokeDasharray="14 10" />
        <circle cx="400" cy="140" r="34" fill="none" stroke={cordColor} strokeWidth="10" />
        <circle cx="400" cy="188" r="12" fill={cordColor} />
        <line x1="400" y1="188" x2="400" y2="300" stroke={cordColor} strokeWidth="8" />
        <line x1="256" y1="300" x2="544" y2="300" stroke={cordColor} strokeWidth="8" strokeLinecap="square" />
        <line x1="260" y1="300" x2="260" y2="815" stroke={cordColor} strokeWidth="8" />
        <line x1="540" y1="300" x2="540" y2="860" stroke={cordColor} strokeWidth="8" />

        <Pill x={260} width={150} text="Nhánh 1 · Charm" />
        <Pill x={540} width={130} text="Nhánh 2 · Chữ" />
        <Pill x={690} width={130} text="Nhánh 3 · Dây" />

        {charmSlots.map((index) => {
          const item = charm(index);
          const y = 450 + index * 90;
          const x = arrangement === 'random' ? [260, 282, 240][index] : 260;
          return <Slot key={`charm-${index}`} x={x} y={y} value={item} fallback={index + 1} />;
        })}
        {letterSlots.map((index) => {
          const value = enteredLetters[index];
          const y = 420 + index * 76;
          return <Slot key={`letter-${index}`} x={540} y={y} value={value ? { name: value, letter: value } : null} fallback={index + 1} filled={Boolean(value)} letterStyle={letterStyle} />;
        })}

        <Tassel x={260} y={835} color={cordColor} />
        <Tassel x={540} y={860} color={cordColor} />
        <Tassel x={690} y={835} color={cordColor} />

        <text x="260" y="945" textAnchor="middle" fontFamily={labelFont} fontSize="18" fontWeight="700" fill="#3a5a35">Charm</text>
        <text x="260" y="968" textAnchor="middle" fontFamily={labelFont} fontSize="15" fill="#3a5a35">tối thiểu 1 · tối đa 3</text>
        <text x="540" y="945" textAnchor="middle" fontFamily={labelFont} fontSize="18" fontWeight="700" fill="#3a5a35">Chữ</text>
        <text x="540" y="968" textAnchor="middle" fontFamily={labelFont} fontSize="15" fill="#3a5a35">tối thiểu 2 · tối đa 5</text>
        <text x="690" y="945" textAnchor="middle" fontFamily={labelFont} fontSize="18" fontWeight="700" fill="#3a5a35">Dây phụ</text>
        <text x="690" y="968" textAnchor="middle" fontFamily={labelFont} fontSize="15" fill="#3a5a35">phối theo màu dây</text>
      </svg>
    </div>
  );
}

function Pill({ x, width, text }) {
  return <><rect x={x - width / 2} y="340" width={width} height="38" rx="19" fill="#d14fa5" /><text x={x} y="364" textAnchor="middle" fontFamily="'DM Sans', Arial, sans-serif" fontSize="14" fontWeight="700" fill="#fff">{text}</text></>;
}

function Slot({ x, y, value, fallback, filled = Boolean(value), letterStyle = 'bubble' }) {
  const bubble = filled && Boolean(value?.letter) && letterStyle === 'bubble';
  const fill = filled ? (bubble ? 'url(#bubbleGradient)' : letterStyle === 'basic' ? '#fffdf7' : '#d14fa5') : '#f0e9dc';
  const stroke = filled ? (letterStyle === 'basic' ? '#3a5a35' : '#d14fa5') : '#3a5a35';
  return <><circle cx={x} cy={y} r="32" fill={fill} stroke={stroke} strokeWidth="3" strokeDasharray={filled ? undefined : '7 6'} filter={bubble ? 'url(#bubbleShadow)' : undefined} />{bubble && <ellipse cx={x - 11} cy={y - 16} rx="9" ry="5" fill="#fff" opacity=".7" transform={`rotate(-25 ${x - 11} ${y - 16})`} />}{value?.image ? <image href={value.image} x={x - 27} y={y - 27} width="54" height="54" preserveAspectRatio="xMidYMid slice" opacity=".9" /> : <text x={x} y={y + 9} textAnchor="middle" fontFamily="'DM Sans', Arial, sans-serif" fontSize="24" fontWeight="700" fill={bubble ? '#fff' : '#3a5a35'}>{value?.letter || value?.icon || fallback}</text>}</>;
}

function Tassel({ x, y, color }) {
  return <><circle cx={x} cy={y} r="17" fill={color} /><path d={`M${x} ${y + 15} L${x - 14} ${y + 70} M${x} ${y + 15} L${x} ${y + 75} M${x} ${y + 15} L${x + 14} ${y + 70}`} stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" /></>;
}

export default Preview;

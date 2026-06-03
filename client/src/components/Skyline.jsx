export default function Skyline() {
  return (
    <svg
      viewBox="0 0 800 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        width: '100%',
        pointerEvents: 'none',
        opacity: 0.18,
      }}
    >
      {/* Background buildings */}
      <rect x="0"   y="120" width="60"  height="80"  fill="#2a0050" />
      <rect x="10"  y="90"  width="20"  height="30"  fill="#2a0050" />
      <rect x="55"  y="100" width="50"  height="100" fill="#1e0040" />
      <rect x="70"  y="70"  width="20"  height="32"  fill="#1e0040" />
      <rect x="100" y="80"  width="40"  height="120" fill="#250048" />
      <rect x="115" y="50"  width="10"  height="32"  fill="#250048" />
      <rect x="135" y="110" width="30"  height="90"  fill="#1a003a" />
      <rect x="160" y="60"  width="55"  height="140" fill="#2e0055" />
      <rect x="175" y="30"  width="10"  height="32"  fill="#2e0055" />
      <rect x="180" y="42"  width="4"   height="10"  fill="#ff00ff" />
      <rect x="210" y="95"  width="45"  height="105" fill="#200042" />
      <rect x="250" y="75"  width="35"  height="125" fill="#280050" />
      <rect x="262" y="50"  width="10"  height="27"  fill="#280050" />
      <rect x="280" y="130" width="25"  height="70"  fill="#1c0038" />
      <rect x="300" y="85"  width="50"  height="115" fill="#240048" />
      <rect x="316" y="55"  width="12"  height="32"  fill="#240048" />
      <rect x="320" y="48"  width="4"   height="10"  fill="#00ffff" opacity="0.5"/>
      <rect x="345" y="100" width="40"  height="100" fill="#1e003e" />
      <rect x="380" y="65"  width="55"  height="135" fill="#2c0052" />
      <rect x="395" y="35"  width="10"  height="32"  fill="#2c0052" />
      <rect x="398" y="28"  width="4"   height="10"  fill="#ff00ff" opacity="0.6"/>
      <rect x="430" y="90"  width="40"  height="110" fill="#220044" />
      <rect x="465" y="70"  width="45"  height="130" fill="#280050" />
      <rect x="478" y="42"  width="12"  height="30"  fill="#280050" />
      <rect x="505" y="110" width="30"  height="90"  fill="#1a0036" />
      <rect x="530" y="80"  width="50"  height="120" fill="#260048" />
      <rect x="545" y="50"  width="14"  height="32"  fill="#260048" />
      <rect x="548" y="43"  width="4"   height="10"  fill="#00ffff" opacity="0.4"/>
      <rect x="575" y="95"  width="35"  height="105" fill="#200040" />
      <rect x="605" y="65"  width="55"  height="135" fill="#2a004e" />
      <rect x="620" y="35"  width="10"  height="32"  fill="#2a004e" />
      <rect x="623" y="28"  width="4"   height="9"   fill="#ff00ff" opacity="0.5"/>
      <rect x="655" y="105" width="40"  height="95"  fill="#1c003c" />
      <rect x="690" y="75"  width="45"  height="125" fill="#240046" />
      <rect x="703" y="48"  width="10"  height="29"  fill="#240046" />
      <rect x="730" y="120" width="30"  height="80"  fill="#1e003e" />
      <rect x="755" y="85"  width="45"  height="115" fill="#2c0050" />
      <rect x="770" y="55"  width="12"  height="32"  fill="#2c0050" />

      {/* Window lights */}
      {[165,172,179,186,166,173,210,217,224,305,312,319,385,392,399,470,477,535,542,610,617,695,702,760,767].map((x, i) => (
        <rect key={i} x={x} y={[95,105,115,125,135,145][i%6]} width="4" height="3"
          fill={i % 3 === 0 ? '#00ffff' : i % 3 === 1 ? '#ff00ff' : '#aaff00'}
          opacity="0.7" />
      ))}
    </svg>
  );
}

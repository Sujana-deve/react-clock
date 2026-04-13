import { useEffect, useRef, useState } from "react";

const HOURS   = ["12","1","2","3","4","5","6","7","8","9","10","11"];
const DAYS    = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS  = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size:  2 + Math.random() * 3,
  x:     Math.random() * 100,
  delay: Math.random() * 6,
  dur:   5 + Math.random() * 6,
}));

export default function App() {
  const [time, setTime]   = useState(new Date());
  const [pulse, setPulse] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    let last = -1;
    function loop() {
      const now = new Date();
      setTime(new Date());
      if (now.getSeconds() !== last) {
        last = now.getSeconds();
        setPulse(true);
        setTimeout(() => setPulse(false), 180);
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const ms  = time.getMilliseconds();
  const s   = time.getSeconds();
  const m   = time.getMinutes();
  const h   = time.getHours() % 12;

  const secDeg  = (s + ms / 1000) * 6;
  const minDeg  = (m + s / 60)    * 6;
  const hourDeg = (h + m / 60)    * 30;

  const hh    = String(time.getHours()).padStart(2,"0");
  const mm    = String(m).padStart(2,"0");
  const ss    = String(s).padStart(2,"0");
  const ampm  = time.getHours() >= 12 ? "PM" : "AM";
  const dateStr = `${DAYS[time.getDay()]}, ${MONTHS[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`;

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* floating particles */}
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          ...styles.particle,
          width: p.size, height: p.size,
          left: `${p.x}%`,
          animationDuration: `${p.dur}s`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}

      {/* glow orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.orb3} />

      {/* card */}
      <div style={styles.card}>

        {/* digital row */}
        <div style={styles.digitalRow}>
          <span style={styles.digitalTime}>{hh}:{mm}:{ss}</span>
          <span style={styles.ampm}>{ampm}</span>
        </div>

        {/* clock */}
        <div style={{ ...styles.clockRing, ...(pulse ? styles.clockRingPulse : {}) }}>
          <div style={styles.clockFace}>

            {/* outer minute ticks */}
            {Array.from({ length: 60 }, (_, i) => {
              const isMaj = i % 5 === 0;
              const ang   = (i / 60) * 360;
              return (
                <div key={i} style={{
                  position:"absolute", left:"50%", top: isMaj ? 6 : 9,
                  width: isMaj ? 2.5 : 1.5,
                  height: isMaj ? 14 : 8,
                  background: isMaj ? "rgba(255,220,130,0.9)" : "rgba(255,220,130,0.35)",
                  borderRadius: 2,
                  marginLeft: isMaj ? -1.25 : -0.75,
                  transform: `rotate(${ang}deg)`,
                  transformOrigin: "50% 197px",
                }} />
              );
            })}

            {/* hour numbers */}
            {HOURS.map((lbl, i) => {
              const ang = (i / 12) * 2 * Math.PI - Math.PI / 2;
              const r   = 156;
              return (
                <span key={lbl} style={{
                  position:"absolute",
                  left: `calc(50% + ${Math.cos(ang) * r}px)`,
                  top:  `calc(50% + ${Math.sin(ang) * r}px)`,
                  transform:"translate(-50%,-50%)",
                  fontFamily:"'Nunito',sans-serif",
                  fontSize: 17, fontWeight: 800,
                  color: i === 0 ? "#ffd97d" : "rgba(255,220,130,0.75)",
                  letterSpacing: -0.5,
                  textShadow: i === 0 ? "0 0 14px rgba(255,210,80,0.9)" : "none",
                }}>
                  {lbl}
                </span>
              );
            })}

            {/* hour hand */}
            <div style={{
              ...styles.hand,
              ...styles.hourHand,
              transform: `rotate(${hourDeg}deg)`,
            }} />

            {/* minute hand */}
            <div style={{
              ...styles.hand,
              ...styles.minHand,
              transform: `rotate(${minDeg}deg)`,
            }} />

            {/* second hand */}
            <div style={{
              ...styles.hand,
              ...styles.secHand,
              transform: `rotate(${secDeg}deg)`,
            }} />

            {/* center cap layers */}
            <div style={styles.capOuter} />
            <div style={styles.capInner} />
            <div style={styles.capDot}   />

          </div>
        </div>

        {/* date */}
        <div style={styles.dateRow}>{dateStr}</div>

        {/* dot indicators */}
        <div style={styles.dotsRow}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{
              ...styles.dot,
              background: i < Math.ceil(h + m / 60) ? "#ffd97d" : "rgba(255,220,130,0.2)",
              boxShadow:  i < Math.ceil(h + m / 60) ? "0 0 6px #ffd97d" : "none",
            }} />
          ))}
        </div>

      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh", width: "100%",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg,#0d0d1a 0%,#12102b 40%,#0a1520 100%)",
    position: "relative", overflow: "hidden",
    fontFamily: "'Nunito',sans-serif",
  },

  orb1: { position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(120,80,255,0.18) 0%,transparent 70%)", top:"-10%", left:"-10%", pointerEvents:"none" },
  orb2: { position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,180,60,0.12) 0%,transparent 70%)", bottom:"-5%", right:"-5%", pointerEvents:"none" },
  orb3: { position:"absolute", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(60,180,255,0.1) 0%,transparent 70%)", top:"30%", right:"5%", pointerEvents:"none" },

  particle: {
    position:"absolute", borderRadius:"50%",
    background:"rgba(255,220,130,0.55)",
    animation:"floatUp linear infinite",
    pointerEvents:"none",
  },

  card: {
    position:"relative", zIndex:10,
    display:"flex", flexDirection:"column", alignItems:"center", gap:20,
    background:"rgba(255,255,255,0.04)",
    border:"1px solid rgba(255,220,130,0.18)",
    borderRadius:32, padding:"36px 48px 32px",
    backdropFilter:"blur(18px)",
    boxShadow:"0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
  },

  digitalRow: { display:"flex", alignItems:"baseline", gap:8 },
  digitalTime: { fontSize:38, fontWeight:800, color:"#ffd97d", letterSpacing:3, textShadow:"0 0 24px rgba(255,210,80,0.55)" },
  ampm:        { fontSize:16, fontWeight:700, color:"rgba(255,220,130,0.55)", letterSpacing:2 },

  clockRing: {
    width:420, height:420, borderRadius:"50%",
    background:"linear-gradient(145deg,rgba(255,220,100,0.07),rgba(80,60,200,0.04))",
    border:"2px solid rgba(255,220,130,0.22)",
    boxShadow:"0 0 0 8px rgba(255,220,130,0.04), 0 0 60px rgba(255,180,40,0.1)",
    display:"flex", alignItems:"center", justifyContent:"center",
    transition:"box-shadow 0.15s ease",
  },
  clockRingPulse: {
    boxShadow:"0 0 0 8px rgba(255,220,130,0.08), 0 0 80px rgba(255,180,40,0.22)",
  },

  clockFace: {
    width:400, height:400, borderRadius:"50%", position:"relative",
    background:"radial-gradient(circle at 35% 30%, rgba(255,220,100,0.06) 0%, rgba(10,8,28,0.95) 60%)",
    border:"1px solid rgba(255,220,130,0.12)",
  },

  hand: {
    position:"absolute", left:"50%", bottom:"50%",
    transformOrigin:"50% 100%",
    borderRadius:"99px 99px 4px 4px",
  },
  hourHand: {
    width:8, height:110,
    marginLeft:-4,
    background:"linear-gradient(to top, rgba(255,210,80,1) 0%, rgba(255,240,160,0.9) 100%)",
    boxShadow:"0 0 10px rgba(255,210,80,0.6)",
  },
  minHand: {
    width:5, height:150,
    marginLeft:-2.5,
    background:"linear-gradient(to top, rgba(220,190,80,0.9) 0%, rgba(255,240,180,0.85) 100%)",
    boxShadow:"0 0 8px rgba(255,210,80,0.4)",
  },
  secHand: {
    width:2.5, height:168,
    marginLeft:-1.25,
    background:"linear-gradient(to top, #ff6b6b 0%, #ff9f9f 100%)",
    boxShadow:"0 0 10px rgba(255,80,80,0.7)",
  },

  capOuter: {
    position:"absolute", width:22, height:22, borderRadius:"50%",
    top:"50%", left:"50%", transform:"translate(-50%,-50%)",
    background:"rgba(255,210,80,0.25)", zIndex:8,
  },
  capInner: {
    position:"absolute", width:14, height:14, borderRadius:"50%",
    top:"50%", left:"50%", transform:"translate(-50%,-50%)",
    background:"#ffd97d", zIndex:9, boxShadow:"0 0 10px rgba(255,210,80,0.8)",
  },
  capDot: {
    position:"absolute", width:6, height:6, borderRadius:"50%",
    top:"50%", left:"50%", transform:"translate(-50%,-50%)",
    background:"#fff", zIndex:10,
  },

  dateRow: {
    fontSize:13, fontWeight:700,
    color:"rgba(255,220,130,0.6)",
    letterSpacing:1.5, textTransform:"uppercase",
  },

  dotsRow: { display:"flex", gap:6, alignItems:"center" },
  dot: { width:7, height:7, borderRadius:"50%", transition:"background 0.4s, box-shadow 0.4s" },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap');

  @keyframes floatUp {
    0%   { transform: translateY(100vh) scale(0); opacity:0; }
    10%  { opacity:1; }
    90%  { opacity:0.6; }
    100% { transform: translateY(-10vh) scale(1); opacity:0; }
  }
`;
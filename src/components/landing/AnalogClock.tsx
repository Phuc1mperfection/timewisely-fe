import React from "react";
import ClockFace from "@/assets/clock-face.svg";
import ClockHourHand from "@/assets/clock-hour-hand.svg";
import ClockMinuteHand from "@/assets/clock-minute-hand.svg";
import ClockSecondHand from "@/assets/clock-second-hand.svg";
import ClockCenterDot from "@/assets/clock-center-dot.svg";

const AnalogClock = () => {
  const now = new Date();
  const [time, setTime] = React.useState(now);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const sec = time.getSeconds();
  const min = time.getMinutes();
  const hour = time.getHours();

  const secAngle = sec * 6;
  const minAngle = min * 6 + sec * 0.1;
  const hourAngle = (hour % 12) * 30 + min * 0.5;

  // Render hour marks
  const hourMarks = Array.from({ length: 12 }).map((_, i) => {
    const angle = i * 30 * (Math.PI / 180);
    const r1 = 74,
      r2 = 80,
      cx = 80,
      cy = 80;
    const x1 = cx + r1 * Math.sin(angle);
    const y1 = cy - r1 * Math.cos(angle);
    const x2 = cx + r2 * Math.sin(angle);
    const y2 = cy - r2 * Math.cos(angle);
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#fff"
        strokeWidth={i % 3 === 0 ? 4 : 2}
      />
    );
  });

  // Render hour numbers
  const hourNumbers = Array.from({ length: 12 }).map((_, i) => {
    const number = i === 0 ? 12 : i;
    const angle = (i * 30 - 60) * (Math.PI / 180); // -60 to start at top
    const r = 62; // radius for numbers
    const cx = 80 + r * Math.cos(angle);
    const cy = 80 + r * Math.sin(angle) + 6; // +6 to center vertically
    return (
      <text
        key={number}
        x={cx}
        y={cy}
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="#a78bcf"
        fontFamily="inherit"
        style={{ userSelect: "none" }}
      >
        {number}
      </text>
    );
  });

  return (
    <svg
      width="320"
      height="320"
      viewBox="0 0 160 160"
      className="mx-auto mb-6 drop-shadow-xl"
    >
      <image href={ClockFace} x="0" y="0" width="160" height="160" />
      {/* Hour marks */}
      {hourMarks}
      {/* Hour numbers */}
      {hourNumbers}
      {/* Hour hand */}
      <image
        href={ClockHourHand}
        x="0"
        y="0"
        width="160"
        height="160"
        style={{
          transform: `rotate(${hourAngle}deg)`,
          transformOrigin: "80px 80px",
        }}
      />
      {/* Minute hand */}
      <image
        href={ClockMinuteHand}
        x="0"
        y="0"
        width="160"
        height="160"
        style={{
          transform: `rotate(${minAngle}deg)`,
          transformOrigin: "80px 80px"
          ,
        }}
      />
      {/* Second hand */}
      <image
        href={ClockSecondHand}
        x="0"
        y="0"
        width="160"
        height="160"
        style={{
          transform: `rotate(${secAngle}deg)`,
          transformOrigin: "80px 80px",
        }}
      />
      {/* Center dot */}
      <image href={ClockCenterDot} x="0" y="0" width="160" height="160" />
    </svg>
  );
};

export default AnalogClock;

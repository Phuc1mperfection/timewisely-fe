import React, { useEffect, useState } from "react";

const AnalogClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getHourAngle = () => {
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    return hours * 30 + minutes * 0.5;
  };

  const getMinuteAngle = () => {
    return time.getMinutes() * 6;
  };

  const getSecondAngle = () => {
    return time.getSeconds() * 6;
  };

  const generateHourMarks = () => {
    return Array.from({ length: 12 }, (_, i) => (
      <div
        key={i}
        className="absolute w-1 h-8 bg-gradient-to-b from-purple-400 to-indigo-600 rounded-full"
        style={{
          top: "10px",
          left: "50%",
          transformOrigin: "50% 140px",
          transform: `translateX(-50%) rotate(${i * 30}deg)`,
        }}
      />
    ));
  };

  const generateMinuteMarks = () => {
    return Array.from({ length: 60 }, (_, i) => {
      if (i % 5 !== 0) {
        return (
          <div
            key={i}
            className="absolute w-0.5 h-4 bg-gray-400 rounded-full opacity-60"
            style={{
              top: "20px",
              left: "50%",
              transformOrigin: "50% 130px",
              transform: `translateX(-50%) rotate(${i * 6}deg)`,
            }}
          />
        );
      }
      return null;
    });
  };

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Clock outer ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20  border-2 border-white/30 clock-face">
        {/* Hour marks */}
        {generateHourMarks()}
        {/* Minute marks */}
        {generateMinuteMarks()}

        {/* Clock center */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-30 shadow-lg" />

        {/* Hour hand */}
        <div
          className="absolute top-1/2 left-1/2 w-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-full shadow-lg z-20 clock-hand"
          style={{
            height: "80px",
            transform: `translate(-50%, -100%) rotate(${getHourAngle()}deg)`,
            transformOrigin: "50% 100%",
          }}
        />

        {/* Minute hand */}
        <div
          className="absolute top-1/2 left-1/2 w-0.5 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-full shadow-lg z-20 clock-hand"
          style={{
            height: "110px",
            transform: `translate(-50%, -100%) rotate(${getMinuteAngle()}deg)`,
            transformOrigin: "50% 100%",
          }}
        />

        {/* Second hand */}
        <div
          className="absolute top-1/2 left-1/2 w-0.5 bg-gradient-to-t from-red-500 to-pink-400 rounded-full shadow-lg z-20 clock-hand"
          style={{
            height: "120px",
            transform: `translate(-50%, -100%) rotate(${getSecondAngle()}deg)`,
            transformOrigin: "50% 100%",
          }}
        />

        {/* Digital time display */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2  px-4 py-2 rounded-lg">
          <span className="text-sm font-mono text-white">
            {time.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="floating-shape absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-mint-400 to-mint-500 rounded-full opacity-60" />
      <div className="floating-shape absolute -bottom-6 -left-6 w-6 h-6 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg opacity-60" />
      <div className="floating-shape absolute top-10 -left-8 w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full opacity-60" />
    </div>
  );
};

export default AnalogClock;

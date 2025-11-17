import React, { useEffect, useState } from "react";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

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
        className="absolute w-1 h-8 bg-gradient-to-b from-yellow-400 to-orange-700 rounded-full"
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
    <CardContainer className="py-10" containerClassName="w-auto h-auto">
      <CardBody className="relative w-80 h-80 mx-auto rounded-full ">
        <CardItem
          translateZ={50}
          className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(139,92,246,0.5)]"
        >
          {/* Hour marks */}
          {generateHourMarks()}
          {/* Minute marks */}
          {generateMinuteMarks()}

          {/* Clock center */}
          <CardItem
            translateZ={60}
            className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-br from-yellow-500 to-orange-700 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-30 shadow-lg"
          >
            <div />
          </CardItem>

          {/* Hour hand wrapper with CardItem */}
          <CardItem
            translateZ={40}
            className="absolute top-1/2 left-1/2 pointer-events-none"
          >
            <div
              className="w-1 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-full shadow-lg z-20 clock-hand"
              style={{
                height: "80px",
                transform: `translate(-50%, -100%) rotate(${getHourAngle()}deg)`,
                transformOrigin: "50% 100%",
                position: "absolute",
              }}
            />
          </CardItem>

          {/* Minute hand wrapper with CardItem */}
          <CardItem
            translateZ={30}
            className="absolute top-1/2 left-1/2 pointer-events-none"
          >
            <div
              className="w-0.5 bg-gradient-to-t from-orange-700 to-orange-500 rounded-full shadow-lg z-20 clock-hand"
              style={{
                height: "110px",
                transform: `translate(-50%, -100%) rotate(${getMinuteAngle()}deg)`,
                transformOrigin: "50% 100%",
                position: "absolute",
              }}
            />
          </CardItem>

          {/* Second hand wrapper with CardItem */}
          <CardItem
            translateZ={20}
            className="absolute top-1/2 left-1/2 pointer-events-none"
          >
            <div
              className="w-0.5 bg-gradient-to-t from-red-500 to-amber-300 rounded-full shadow-lg z-20 clock-hand"
              style={{
                height: "120px",
                transform: `translate(-50%, -100%) rotate(${getSecondAngle()}deg)`,
                transformOrigin: "50% 100%",
                position: "absolute",
              }}
            />
          </CardItem>

          {/* Digital time display */}
          <CardItem
            translateZ={80}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 rounded-lg 
             bg-black/30 backdrop-blur-sm border border-white/20 shadow-md"
          >
            <span className="text-base font-mono text-white tracking-wide">
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </CardItem>
        </CardItem>

      </CardBody>
    </CardContainer>
  );
};

export default AnalogClock;

import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { Heart, X } from "lucide-react";

export interface SwipeCardData {
  id: string;
  title: string;
  emoji: string;
  category: string;
  description: string;
}

interface SwipeCardProps {
  card: SwipeCardData;
  onSwipe: (direction: "left" | "right", cardId: string) => void;
  isTop: boolean;
}

const SWIPE_THRESHOLD = 100;

// Get gradient based on category
const getCategoryGradient = (category: string): string => {
  const gradients: Record<string, string> = {
    Fitness: "from-rose-400 to-orange-400",
    Learning: "from-blue-400 to-indigo-500",
    Wellness: "from-emerald-400 to-teal-500",
    Creative: "from-purple-400 to-pink-500",
    Social: "from-amber-400 to-yellow-500",
    "Work/Productivity": "from-slate-400 to-gray-600",
    "Cooking/Nutrition": "from-green-400 to-lime-500",
  };
  return gradients[category] || "from-gray-400 to-gray-500";
};

export function SwipeCard({ card, onSwipe, isTop }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(velocity) >= 500 || Math.abs(offset) >= SWIPE_THRESHOLD) {
      const direction = offset > 0 ? "right" : "left";
      setExitX(offset > 0 ? 500 : -500);
      onSwipe(direction, card.id);
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full"
      style={{
        x,
        rotate,
        opacity,
        zIndex: isTop ? 10 : 1,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX, opacity: 0 } : {}}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <div
        className={`relative w-full h-full rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br ${getCategoryGradient(
          card.category
        )}`}
      >
        {/* Background Gradient with Large Emoji */}
        <div className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing">
          <span className="text-9xl opacity-20">{card.emoji}</span>
        </div>

        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-8 left-8 transform -rotate-12 bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-2xl border-4 border-white shadow-lg"
          style={{
            opacity: useTransform(x, [-200, -50, 0], [1, 0.5, 0]),
          }}
        >
          NOPE
        </motion.div>

        <motion.div
          className="absolute top-8 right-8 transform rotate-12 bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-2xl border-4 border-white shadow-lg"
          style={{
            opacity: useTransform(x, [0, 50, 200], [0, 0.5, 1]),
          }}
        >
          LIKE
        </motion.div>

        {/* Card Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-5xl">{card.emoji}</span>
            <div>
              <h3 className="text-2xl font-bold">{card.title}</h3>
              <span className="inline-block px-3 py-1 bg-[var(--wisely-gold)] text-white text-xs font-semibold rounded-full mt-1">
                {card.category}
              </span>
            </div>
          </div>
          <p className="text-white/90 text-sm leading-relaxed">
            {card.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

interface SwipeCardStackProps {
  cards: SwipeCardData[];
  onSwipe: (direction: "left" | "right", cardId: string) => void;
  onComplete: (likedCards: string[]) => void;
}

export function SwipeCardStack({
  cards,
  onSwipe,
  onComplete,
}: SwipeCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCards, setLikedCards] = useState<string[]>([]);

  const handleSwipe = (direction: "left" | "right", cardId: string) => {
    if (direction === "right") {
      setLikedCards((prev) => [...prev, cardId]);
    }

    onSwipe(direction, cardId);

    // Move to next card
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      // Check if we've swiped through all cards
      if (nextIndex >= cards.length) {
        onComplete(
          direction === "right" ? [...likedCards, cardId] : likedCards
        );
      }
    }, 300);
  };

  const handleButtonSwipe = (direction: "left" | "right") => {
    if (currentIndex < cards.length) {
      handleSwipe(direction, cards[currentIndex].id);
    }
  };

  if (currentIndex >= cards.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-6xl">🎉</div>
        <h3 className="text-2xl font-bold text-[var(--wisely-dark)]">
          All Done!
        </h3>
        <p className="text-[var(--wisely-gray)]">
          You liked {likedCards.length} out of {cards.length} activities
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height: "500px" }}>
      {/* Card Stack */}
      <div className="relative w-full h-full">
        {cards.slice(currentIndex, currentIndex + 3).map((card, index) => (
          <div
            key={card.id}
            className="absolute inset-0"
            style={{
              zIndex: cards.length - index,
            }}
          >
            <SwipeCard card={card} onSwipe={handleSwipe} isTop={index === 0} />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
        <button
          onClick={() => handleButtonSwipe("left")}
          className="w-16 h-16 rounded-full bg-white border-4 border-red-500 text-red-500 hover:bg-red-50 transition-all shadow-lg hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label="Dislike"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="text-center">
          <p className="text-sm text-[var(--wisely-gray)] font-medium">
            {currentIndex + 1} / {cards.length}
          </p>
        </div>

        <button
          onClick={() => handleButtonSwipe("right")}
          className="w-16 h-16 rounded-full bg-white border-4 border-green-500 text-green-500 hover:bg-green-50 transition-all shadow-lg hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label="Like"
        >
          <Heart className="w-8 h-8 fill-current" />
        </button>
      </div>
    </div>
  );
}

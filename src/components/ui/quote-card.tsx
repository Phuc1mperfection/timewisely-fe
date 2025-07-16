"use client";
import React from "react";
import { cn } from "@/lib/utils";

export interface QuoteOverlayCardProps {
  backgroundImage: string;  // background tĩnh
  quote: string;
  author: string;
  gifUrl?: string;          // gif overlay toàn màn khi hover
  className?: string;
}

export const QuoteOverlayCard: React.FC<QuoteOverlayCardProps> = ({
  backgroundImage,
  quote,
  author,
  gifUrl,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative w-full h-100 rounded-lg overflow-hidden group cursor-pointer",
        className
      )}
    >
      {/* Background image (tĩnh) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      {/* GIF overlay thay thế background khi hover */}
      {gifUrl && (
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          )}
          style={{
            backgroundImage: `url(${gifUrl})`,
          }}
        />
      )}

      {/* overlay tint */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />

      {/* Text content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white z-10">
        <p className="text-lg italic mb-2">{quote}</p>
        <p className="text-sm font-medium">— {author}</p>
      </div>
    </div>
  );
};

import React from "react";

interface AvatarSectionProps {
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  onAvatarChange?: (filename: string) => void;
}

export const AvatarSection: React.FC<AvatarSectionProps> = ({
  username,
  fullName,
  avatarUrl,
  // onAvatarChange,
}) => {
  const initial =
    fullName?.trim()?.charAt(0)?.toUpperCase() ||
    (username?.charAt(0)?.toUpperCase() ?? "U");
  return (
    <div className="flex items-center gap-4 mb-6">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover border"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center text-2xl font-bold border text-primary">
          {initial}
        </div>
      )}
      <div>
        <div className="font-semibold text-lg">
          {fullName || username || "User"}
        </div>
      </div>
    </div>
  );
};

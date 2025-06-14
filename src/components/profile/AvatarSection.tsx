import React from "react";

interface AvatarSectionProps {
  username?: string;
  onAvatarChange?: (filename: string) => void;
}

export const AvatarSection: React.FC<AvatarSectionProps> = ({
  username,
  onAvatarChange,
}) => {
  // Dummy avatar, you can replace with real upload logic
  return (
    <div className="flex items-center gap-4 mb-6">
      <img
        src="/default-avatar.png"
        alt="Avatar"
        className="w-16 h-16 rounded-full object-cover border"
      />
      <div>
        <div className="font-semibold text-lg">{username || "User"}</div>
        <button
          type="button"
          className="text-primary underline text-sm mt-1"
          onClick={() => onAvatarChange && onAvatarChange("hinh-cute-meo.jpg")}
        >
          Change Avatar
        </button>
      </div>
    </div>
  );
};

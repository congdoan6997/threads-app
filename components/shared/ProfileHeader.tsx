import Image from "next/image";
import React from "react";

interface ProfileHeaderProps {
  currentUserId: string;
  authUserId: string;
  name: string;
  username: string;
  image: string;
  bio: string;
}

const ProfileHeader = ({
  currentUserId,
  authUserId,
  name,
  username,
  image,
  bio,
}: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col w-full justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20">
            <Image
              src={image}
              alt={name}
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1 ">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
      </div>
      {/* TOTO COMMUNITY */}
      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;

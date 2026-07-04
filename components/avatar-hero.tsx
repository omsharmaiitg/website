"use client";

import dynamic from "next/dynamic";

// Client wrapper so the Server Component home page can mount the avatar via
// next/dynamic with ssr:false (not allowed directly in a Server Component).
const Avatar = dynamic(() => import("@/components/Avatar"), {
  ssr: false,
  loading: () => null,
});

export function AvatarHero() {
  return <Avatar />;
}

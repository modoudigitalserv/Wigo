"use client";

import { useTransition } from "react";
import { toggleBlockUser } from "@/app/dashboard/users/actions";

export default function UserBlockToggle({ userId, isBlocked }: { userId: string; isBlocked: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleBlockUser(userId, isBlocked);
      } catch (error) {
        console.error(error);
        alert("Une erreur est survenue.");
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 ${
        isBlocked ? "bg-red-500" : "bg-zinc-700"
      }`}
    >
      <span className="sr-only">Toggle block status</span>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isBlocked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

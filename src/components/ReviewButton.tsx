"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewModal from "./ReviewModal";

interface ReviewButtonProps {
  bookingId: string;
  companyId: string;
  carId: string;
  carName: string;
}

export default function ReviewButton({ bookingId, companyId, carId, carName }: ReviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs px-4"
        size="sm"
      >
        <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
        Évaluer
      </Button>

      <ReviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        bookingId={bookingId}
        companyId={companyId}
        carId={carId}
        carName={carName}
      />
    </>
  );
}

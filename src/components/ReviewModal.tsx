"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from "@/app/dashboard/bookings/actions";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  companyId: string;
  carId: string;
  carName: string;
}

export default function ReviewModal({ isOpen, onClose, bookingId, companyId, carId, carName }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Veuillez sélectionner une note.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await submitReview(bookingId, companyId, carId, rating, comment);
      if (result.error) {
        setError(result.error);
      } else {
        onClose();
        // Optionnel : Vous pouvez ajouter un toast ici
      }
    } catch (err) {
      setError("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#121217] border border-zinc-800/80 w-full max-w-md rounded-2xl p-6 relative shadow-2xl shadow-emerald-900/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800/50 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Évaluer votre location</h2>
          <p className="text-sm text-zinc-400">
            Comment s&apos;est passée votre expérience avec la <span className="font-semibold text-emerald-400">{carName}</span> ?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoverRating || rating)
                      ? "fill-emerald-500 text-emerald-500"
                      : "text-zinc-700"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2 block">Commentaire (Optionnel)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre avis sur le véhicule, l'état de propreté, la ponctualité..."
              className="bg-zinc-900/50 border-zinc-800 text-white rounded-xl min-h-[100px] resize-none focus:border-emerald-500/50 focus:ring-emerald-500/20"
            />
          </div>

          {error && <p className="text-sm text-red-400 font-medium text-center">{error}</p>}

          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-6 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? "Envoi en cours..." : "Publier l'avis"}
          </Button>
        </form>
      </div>
    </div>,
    document.body
  );
}

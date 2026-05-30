"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X, Headset } from "lucide-react";
import { useState, useCallback } from "react";

const BRANDS = ["Dacia", "Renault", "Peugeot", "Hyundai", "Volkswagen", "Mercedes", "Range Rover"];
const TYPES = ["Citadine", "Berline", "SUV", "Premium", "Sportive"];
const TRANSMISSIONS = ["Manuelle", "Automatique"];
const MAX_PRICE = 2000;
const MIN_PRICE = 150;

export default function CarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMax = parseInt(searchParams.get("maxPrice") || String(MAX_PRICE));
  const [maxPrice, setMaxPrice] = useState(initialMax);

  const pushParams = (params: URLSearchParams) => {
    router.push(`/cars?${params.toString()}`);
  };

  // Brand filter (pills)
  const handleBrandToggle = (brand: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentBrands = params.getAll("brand");
    if (currentBrands.includes(brand)) {
      params.delete("brand");
      currentBrands.filter(b => b !== brand).forEach(b => params.append("brand", b));
    } else {
      params.append("brand", brand);
    }
    pushParams(params);
  };

  // Type filter (radio)
  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("type");
    if (current === type) {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    pushParams(params);
  };

  // Transmission filter (pills)
  const handleTransmissionToggle = (trans: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("transmission");
    if (current === trans) {
      params.delete("transmission");
    } else {
      params.set("transmission", trans);
    }
    pushParams(params);
  };

  // Price filter
  const handlePriceChange = useCallback((value: number) => {
    setMaxPrice(value);
  }, []);

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (maxPrice < MAX_PRICE) {
      params.set("maxPrice", String(maxPrice));
    } else {
      params.delete("maxPrice");
    }
    pushParams(params);
  };

  // Reset all
  const resetFilters = () => {
    setMaxPrice(MAX_PRICE);
    router.push("/cars");
  };

  const selectedBrands = searchParams.getAll("brand");
  const selectedType = searchParams.get("type");
  const selectedTransmission = searchParams.get("transmission");

  return (
    <aside className="w-full md:w-56 shrink-0 space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Filtres</h2>
        <button
          onClick={resetFilters}
          className="text-xs text-zinc-500 hover:text-blue-400 transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      {/* Marque */}
      <div className="space-y-3">
        <h3 className="font-semibold text-zinc-500 uppercase text-[10px] tracking-widest">Marque</h3>
        <div className="flex flex-wrap gap-2">
          {BRANDS.map(brand => {
            const isActive = selectedBrands.includes(brand);
            return (
              <button
                key={brand}
                onClick={() => handleBrandToggle(brand)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20"
                    : "bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white"
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prix / Jour */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-zinc-500 uppercase text-[10px] tracking-widest">Prix / Jour</h3>
          <span className="text-xs text-zinc-400 font-medium">€{MIN_PRICE} – €{maxPrice}</span>
        </div>
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={10}
          value={maxPrice}
          onChange={(e) => handlePriceChange(parseInt(e.target.value))}
          onMouseUp={applyPriceFilter}
          onTouchEnd={applyPriceFilter}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-zinc-800 accent-blue-500"
        />
      </div>


      {/* Transmission */}
      <div className="space-y-3">
        <h3 className="font-semibold text-zinc-500 uppercase text-[10px] tracking-widest">Transmission</h3>
        <div className="flex gap-2">
          {TRANSMISSIONS.map(trans => {
            const isActive = selectedTransmission === trans;
            return (
              <button
                key={trans}
                onClick={() => handleTransmissionToggle(trans)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20"
                    : "bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white"
                }`}
              >
                {trans}
              </button>
            );
          })}
        </div>
      </div>

      {/* Assistance Elite */}
      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-600/20">
        <Headset className="w-4 h-4" />
        Assistance Elite
      </button>
    </aside>
  );
}

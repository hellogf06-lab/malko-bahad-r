import React from "react";
import { usePeriod } from "../contexts/PeriodContext";

const periodOptions = [
  { value: "today", label: "Bugün" },
  { value: "thisWeek", label: "Bu Hafta" },
  { value: "thisMonth", label: "Bu Ay" },
  { value: "last3Months", label: "Son 3 Ay" },
  { value: "thisYear", label: "Bu Yıl" },
  { value: "custom", label: "Özel Tarih Aralığı" },
];

export const PeriodSelector: React.FC = () => {
  const { period, setPeriod, customRange, setCustomRange } = usePeriod();

  return (
    <div className="flex flex-wrap gap-2 items-center mb-4">
      {periodOptions.map((opt) => (
        <button
          key={opt.value}
          className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${period === opt.value ? "bg-blue-600 text-white border-blue-700" : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"}`}
          onClick={() => setPeriod(opt.value as any)}
        >
          {opt.label}
        </button>
      ))}
      {period === "custom" && (
        <>
          <input
            type="date"
            value={customRange.start.toISOString().slice(0, 10)}
            onChange={e => setCustomRange({ ...customRange, start: new Date(e.target.value) })}
            className="ml-2 px-2 py-1 border rounded"
          />
          <span className="mx-1">-</span>
          <input
            type="date"
            value={customRange.end.toISOString().slice(0, 10)}
            onChange={e => setCustomRange({ ...customRange, end: new Date(e.target.value) })}
            className="px-2 py-1 border rounded"
          />
        </>
      )}
    </div>
  );
};

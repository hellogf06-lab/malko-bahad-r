import React, { createContext, useContext, useState } from 'react';

export type PeriodType = 'today' | 'thisWeek' | 'thisMonth' | 'last3Months' | 'thisYear' | 'custom';

interface DateRange {
  start: Date;
  end: Date;
}

interface PeriodContextType {
  period: PeriodType;
  setPeriod: (p: PeriodType) => void;
  customRange: DateRange;
  setCustomRange: (r: DateRange) => void;
}

const defaultRange = { start: new Date(), end: new Date() };

const PeriodContext = createContext<PeriodContextType>({
  period: 'thisMonth',
  setPeriod: () => {},
  customRange: defaultRange,
  setCustomRange: () => {},
});

export const usePeriod = () => useContext(PeriodContext);

export const PeriodProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [period, setPeriod] = useState<PeriodType>('thisMonth');
  const [customRange, setCustomRange] = useState<DateRange>(defaultRange);

  return (
    <PeriodContext.Provider value={{ period, setPeriod, customRange, setCustomRange }}>
      {children}
    </PeriodContext.Provider>
  );
};

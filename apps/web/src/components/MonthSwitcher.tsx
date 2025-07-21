'use client';

import { useState } from 'react';

interface MonthSwitcherProps {
  currentMonth: number; // 1-12
  currentYear: number;
  onMonthChange: (month: number, year: number) => void;
}

const MONTHS = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
];

export function MonthSwitcher({ currentMonth, currentYear, onMonthChange }: MonthSwitcherProps) {
  const goToPreviousMonth = () => {
    const newMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const newYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    onMonthChange(newMonth, newYear);
  };

  const goToNextMonth = () => {
    const newMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const newYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    onMonthChange(newMonth, newYear);
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    onMonthChange(now.getMonth() + 1, now.getFullYear());
  };

  return (
    <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
      {/* Current Month Display */}
      <div>
        <label className="text-sm text-muted-foreground mb-1 block">Období</label>
        <div className="flex items-center space-x-2">
          <select 
            value={currentMonth} 
            onChange={(e) => onMonthChange(parseInt(e.target.value), currentYear)}
            className="bg-background border border-input rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring
                      transition-colors min-w-[120px]"
          >
            {MONTHS.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          
          <input
            type="number"
            value={currentYear}
            min="2020"
            max="2030"
            onChange={(e) => onMonthChange(currentMonth, parseInt(e.target.value))}
            className="bg-background border border-input rounded-md px-3 py-2 text-sm w-24
                      focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring
                      transition-colors"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-2">
        <button 
          onClick={goToPreviousMonth}
          className="px-3 py-2 border border-input rounded-md text-sm hover:bg-muted transition-colors"
        >
          Předchozí
        </button>
        
        <button 
          onClick={goToCurrentMonth}
          className="px-3 py-2 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20 transition-colors"
        >
          Dnes
        </button>
        
        <button 
          onClick={goToNextMonth}
          className="px-3 py-2 border border-input rounded-md text-sm hover:bg-muted transition-colors"
        >
          Další
        </button>
      </div>
    </div>
  );
} 
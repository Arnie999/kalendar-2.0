'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';
import { cs } from 'date-fns/locale';

interface CalendarViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  events: Array<{ date: string; title: string }>;
  holidaysCz: Array<{ date: string; name: string }>;
  holidaysDe: Array<{ date: string; name: string }>;
  shifts: Array<{ date: string; employee: string }>;
}

export function CalendarView({
  currentDate,
  onDateChange,
  events,
  holidaysCz,
  holidaysDe,
  shifts
}: CalendarViewProps) {
  // Získat první a poslední den měsíce
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Dny v týdnu v češtině
  const weekDays = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

  // Funkce pro získání událostí pro daný den
  const getDayEvents = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return {
      events: events.filter(event => event.date === formattedDate),
      holidaysCz: holidaysCz.filter(holiday => holiday.date === formattedDate),
      holidaysDe: holidaysDe.filter(holiday => holiday.date === formattedDate),
      shifts: shifts.filter(shift => shift.date === formattedDate)
    };
  };

  return (
    <div className="w-full">
      {/* Hlavička měsíce */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-heading">
          {format(currentDate, 'LLLL yyyy', { locale: cs })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="btn-secondary"
          >
            Předchozí
          </button>
          <button
            onClick={() => onDateChange(new Date())}
            className="btn-secondary"
          >
            Dnes
          </button>
          <button
            onClick={() => onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="btn-secondary"
          >
            Další
          </button>
        </div>
      </div>

      {/* Kalendářní mřížka */}
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Dny v týdnu */}
        <div className="grid grid-cols-7 bg-muted">
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Dny v měsíci */}
        <div className="grid grid-cols-7 divide-x divide-y divide-border">
          {days.map((day, index) => {
            const dayEvents = getDayEvents(day);
            const hasEvents = Object.values(dayEvents).some(arr => arr.length > 0);
            
            return (
              <div
                key={day.toString()}
                className={`min-h-[100px] p-2 ${
                  !isSameMonth(day, currentDate) ? 'bg-muted/50' :
                  isToday(day) ? 'bg-primary/5' : ''
                }`}
              >
                <div className="text-sm mb-1">
                  {format(day, 'd')}
                </div>
                
                {/* Události */}
                {hasEvents && (
                  <div className="space-y-1">
                    {dayEvents.holidaysCz.map((holiday, i) => (
                      <div key={i} className="text-xs p-1 bg-accent/20 text-accent-foreground rounded-md font-medium">
                        {holiday.name}
                      </div>
                    ))}
                    {dayEvents.holidaysDe.map((holiday, i) => (
                      <div key={i} className="text-xs p-1 bg-accent/15 text-accent-foreground rounded-md">
                        {holiday.name}
                      </div>
                    ))}
                    {dayEvents.events.map((event, i) => (
                      <div key={i} className="text-xs p-1 bg-primary/10 text-primary rounded-md hover:bg-primary/15 transition-colors cursor-pointer">
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.shifts.map((shift, i) => (
                      <div key={i} className="text-xs p-1 bg-muted text-muted-foreground rounded-md">
                        {shift.employee}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 
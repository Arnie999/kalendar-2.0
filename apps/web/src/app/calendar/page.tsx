'use client';

import { useState, useEffect } from 'react';
import { UserProvider } from '@/context/UserContext';
import { CalendarView } from '@/components/CalendarView';
import Link from 'next/link';

interface Event {
  title: string;
  description: string;
  date: string;
  location: string;
  locationImportance: number;
}

interface Holiday {
  date: string;
  localName?: string;
  local_name?: string;
  name?: string;
  english_name?: string;
  countryCode?: string;
  states?: string[];
}

interface Shift {
  name: string;
  station: string;
  date: string;
}

function CalendarPageContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [holidaysCz, setHolidaysCz] = useState<Holiday[]>([]);
  const [holidaysDe, setHolidaysDe] = useState<Holiday[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Načtení dat při mount komponenty
  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        
        // Načtení všech dat paralelně
        const [eventsResponse, holidaysCzResponse, holidaysDeResponse, shiftsResponse] = await Promise.all([
          fetch('/api/data/events'),
          fetch('/api/data/holidays-cz'),
          fetch('/api/data/holidays-de'),
          fetch('/api/data/shifts')
        ]);

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData);
        }

        if (holidaysCzResponse.ok) {
          const holidaysCzData = await holidaysCzResponse.json();
          setHolidaysCz(holidaysCzData);
        }

        if (holidaysDeResponse.ok) {
          const holidaysDeData = await holidaysDeResponse.json();
          setHolidaysDe(holidaysDeData);
        }

        if (shiftsResponse.ok) {
          const shiftsData = await shiftsResponse.json();
          setShifts(shiftsData);
        }

      } catch (error) {
        console.error('Chyba při načítání dat:', error);
        setError('Chyba při načítání dat. Zkuste obnovit stránku.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  
  if (loading) {
    return (
      <main className="min-h-screen">
        <header className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                ← Zpět
              </Link>
              <div>
                <h1 className="text-title">Kalendář</h1>
                <p className="text-body">Načítám data...</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="card text-center py-12">
            <h2 className="text-heading mb-2">Načítám kalendářová data</h2>
            <p className="text-body">Připravuji události, svátky a směny...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen">
        <header className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                ← Zpět
              </Link>
              <div>
                <h1 className="text-title">Kalendář</h1>
                <p className="text-body">Problém s načítáním dat</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="card text-center py-12">
            <h2 className="text-heading mb-2">Chyba při načítání</h2>
            <p className="text-body mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Obnovit stránku
            </button>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                ← Zpět
              </Link>
              <div>
                <h1 className="text-title">Kalendář</h1>
                <p className="text-body">Přehledný kalendář pro šéfa a zaměstnance</p>
              </div>
            </div>

            {/* Data Summary */}
            <div className="text-body space-y-1">
              <div>Události: {events.length} • CZ svátky: {holidaysCz.length} • DE svátky: {holidaysDe.length}</div>
              <div>Směny: {shifts.length} • Počasí: aktivní • Roles: aktivní</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="card">
          <CalendarView 
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            events={events}
            holidaysCz={holidaysCz}
            holidaysDe={holidaysDe}
            shifts={shifts}
          />
        </div>
      </div>
    </main>
  );
}

export default function CalendarPage() {
  return (
    <UserProvider>
      <CalendarPageContent />
    </UserProvider>
  );
} 
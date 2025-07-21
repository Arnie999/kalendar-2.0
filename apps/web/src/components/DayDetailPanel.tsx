'use client';

interface DayDetailPanelProps {
  selectedDate: string;
  events: Array<{type: string, data: any}>;
  onBackToCalendar: () => void;
  onClose: () => void;
}

export function DayDetailPanel({ 
  selectedDate, 
  events, 
  onBackToCalendar, 
  onClose 
}: DayDetailPanelProps) {
  
  // Funkce pro formátování data
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('cs-CZ', options);
  };
  
  // Rozdělení událostí podle typu
  const eventsByType = {
    events: events.filter(e => e.type === 'event'),
    holidaysCz: events.filter(e => e.type === 'holiday-cz'),
    holidaysDe: events.filter(e => e.type === 'holiday-de'),
    shifts: events.filter(e => e.type === 'shifts')
  };
  
  // Počet zaměstnanců v tento den
  const employeeCount = eventsByType.shifts.reduce((count, shiftEvent) => {
    return count + shiftEvent.data.length;
  }, 0);
  
  // Seskupení zaměstnanců podle stanic
  const employeesByStation: Record<string, any[]> = {};
  eventsByType.shifts.forEach(shiftEvent => {
    shiftEvent.data.forEach((shift: any) => {
      const station = shift.station || 'Nezařazeno';
      if (!employeesByStation[station]) {
        employeesByStation[station] = [];
      }
      employeesByStation[station].push(shift);
    });
  });
  
  return (
    <aside>
      <header>
        <button onClick={onBackToCalendar}>← Zpět na kalendář</button>
        <h2>📋 Detail dne</h2>
        <button onClick={onClose}>✕ Zavřít</button>
      </header>
      
      <section>
        <h3>{formatDate(selectedDate)}</h3>
        <p>Datum: {selectedDate}</p>
      </section>
      
      {/* Rychlý přehled */}
      <section>
        <h3>Rychlý přehled</h3>
        <div>
          <div>🎭 Kulturní akce: {eventsByType.events.length}</div>
          <div>🇨🇿 České svátky: {eventsByType.holidaysCz.length}</div>
          <div>🇩🇪 Německé svátky: {eventsByType.holidaysDe.length}</div>
          <div>👥 Zaměstnanců v práci: {employeeCount}</div>
        </div>
      </section>
      
      {/* Zaměstnanci v práci */}
      {employeeCount > 0 && (
        <section>
          <h3>👥 Zaměstnanci v práci ({employeeCount})</h3>
          {Object.entries(employeesByStation).map(([station, employees]) => (
            <div key={station}>
              <h4>{station} ({employees.length})</h4>
              <ul>
                {employees.map((employee, idx) => (
                  <li key={idx}>{employee.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
      
      {/* České svátky */}
      {eventsByType.holidaysCz.length > 0 && (
        <section>
          <h3>🇨🇿 České svátky</h3>
          {eventsByType.holidaysCz.map((holiday, index) => (
            <article key={index}>
              <h4>{holiday.data.localName}</h4>
              <p>{holiday.data.name}</p>
            </article>
          ))}
        </section>
      )}
      
      {/* Německé svátky */}
      {eventsByType.holidaysDe.length > 0 && (
        <section>
          <h3>🇩🇪 Německé svátky</h3>
          {eventsByType.holidaysDe.map((holiday, index) => (
            <article key={index}>
              <h4>{holiday.data.local_name}</h4>
              <p>{holiday.data.english_name}</p>
              {holiday.data.states && (
                <p>Oblast: {holiday.data.states.join(', ')}</p>
              )}
            </article>
          ))}
        </section>
      )}
      
      {/* Kulturní akce */}
      {eventsByType.events.length > 0 && (
        <section>
          <h3>🎭 Kulturní akce ({eventsByType.events.length})</h3>
          {eventsByType.events.map((event, index) => (
            <article key={index}>
              <h4>{event.data.title}</h4>
              <p>{event.data.description}</p>
              {event.data.location && (
                <div>
                  <strong>Místo:</strong> {event.data.location}
                </div>
              )}
              {event.data.locationImportance && (
                <div>
                  <strong>Důležitost:</strong> {event.data.locationImportance}/100
                </div>
              )}
            </article>
          ))}
        </section>
      )}
      
      {/* Rezervace (placeholder) */}
      <section>
        <h3>📅 Rezervace</h3>
        <p>Připraveno pro budoucí implementaci</p>
        <div>
          <p>Zde se budou zobrazovat:</p>
          <ul>
            <li>Rezervace stolů</li>
            <li>Soukromé akce</li>
            <li>Firemní události</li>
            <li>Speciální požadavky</li>
          </ul>
        </div>
      </section>
      
      {/* Prázdný den */}
      {events.length === 0 && (
        <section>
          <h3>🌟 Klidný den</h3>
          <p>Žádné zvláštní události nebo směny tento den</p>
          <div>
            <p>Možnosti:</p>
            <ul>
              <li>Ideální den pro údržbu</li>
              <li>Možnost snížit provoz</li>
              <li>Čas na školení týmu</li>
              <li>Plánování nových akcí</li>
            </ul>
          </div>
        </section>
      )}
      
      {/* Akční tlačítka */}
      <footer>
        <button onClick={onBackToCalendar}>
          📅 Zpět na kalendář
        </button>
        <button onClick={onClose}>
          ✕ Zavřít detail
        </button>
      </footer>
    </aside>
  );
} 
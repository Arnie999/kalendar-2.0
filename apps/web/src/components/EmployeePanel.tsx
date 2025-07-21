'use client';

import { useMemo } from 'react';

interface Shift {
  name: string;
  station: string;
  date: string;
}

interface EmployeePanelProps {
  shifts: Shift[];
  currentDate: Date;
  selectedEmployee: string | null;
  onEmployeeSelect: (employeeName: string | null) => void;
  onBackToCalendar: () => void;
}

interface EmployeeStats {
  name: string;
  station: string;
  totalDays: number;
  weekdays: number;
  weekends: number;
  shifts: Shift[];
}

export function EmployeePanel({ 
  shifts, 
  currentDate, 
  selectedEmployee, 
  onEmployeeSelect,
  onBackToCalendar 
}: EmployeePanelProps) {
  
  // Výpočet statistik zaměstnanců pro aktuální měsíc
  const employeeStats = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Filtrování směn pro aktuální měsíc
    const monthShifts = shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate.getFullYear() === year && shiftDate.getMonth() === month;
    });
    
    // Seskupení podle zaměstnanců
    const employeeGroups: Record<string, Shift[]> = {};
    monthShifts.forEach(shift => {
      if (!employeeGroups[shift.name]) {
        employeeGroups[shift.name] = [];
      }
      employeeGroups[shift.name].push(shift);
    });
    
    // Výpočet statistik
    return Object.entries(employeeGroups).map(([name, employeeShifts]) => {
      const station = employeeShifts[0]?.station || '';
      
      // Počítání víkendů vs všedních dní
      let weekdays = 0;
      let weekends = 0;
      
      employeeShifts.forEach(shift => {
        const shiftDate = new Date(shift.date);
        const dayOfWeek = shiftDate.getDay(); // 0 = neděle, 6 = sobota
        
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          weekends++;
        } else {
          weekdays++;
        }
      });
      
      return {
        name,
        station,
        totalDays: employeeShifts.length,
        weekdays,
        weekends,
        shifts: employeeShifts
      };
    }).sort((a, b) => b.totalDays - a.totalDays); // Seřazení podle počtu směn
  }, [shifts, currentDate]);
  
  const monthNames = [
    'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
    'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
  ];
  
  const monthName = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  
  return (
    <aside>
      <header>
        <button onClick={onBackToCalendar}>← Zpět na kalendář</button>
        <h2>👥 Zaměstnanci - {monthName} {year}</h2>
      </header>
      
      {/* Celkové statistiky */}
      <section>
        <h3>Přehled měsíce</h3>
        <div>
          <p><strong>Celkem zaměstnanců:</strong> {employeeStats.length}</p>
          <p><strong>Celkem směn:</strong> {employeeStats.reduce((sum, emp) => sum + emp.totalDays, 0)}</p>
          <p><strong>Víkendové směny:</strong> {employeeStats.reduce((sum, emp) => sum + emp.weekends, 0)}</p>
        </div>
      </section>
      
      {/* Seznam zaměstnanců */}
      <section>
        <h3>Zaměstnanci</h3>
        {selectedEmployee && (
          <div>
            <p>Zvýrazněno: <strong>{selectedEmployee}</strong></p>
            <button onClick={() => onEmployeeSelect(null)}>
              Zrušit zvýraznění
            </button>
          </div>
        )}
        
        {employeeStats.length === 0 ? (
          <p>Žádní zaměstnanci v tomto měsíci</p>
        ) : (
          <div>
            {employeeStats.map((employee) => (
              <article 
                key={employee.name}
                onClick={() => onEmployeeSelect(
                  selectedEmployee === employee.name ? null : employee.name
                )}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onEmployeeSelect(
                      selectedEmployee === employee.name ? null : employee.name
                    );
                  }
                }}
              >
                <header>
                  <h4>
                    {employee.name}
                    {selectedEmployee === employee.name && ' 🔆'}
                  </h4>
                  {employee.station && <p>Pozice: {employee.station}</p>}
                </header>
                
                <div>
                  <div>
                    <strong>Celkem směn:</strong> {employee.totalDays}
                  </div>
                  <div>
                    <strong>Všední dny:</strong> {employee.weekdays}
                  </div>
                  <div>
                    <strong>Víkendy:</strong> {employee.weekends}
                  </div>
                </div>
                
                {/* Progress indikátor */}
                <div>
                  <small>
                    Víkendy: {Math.round((employee.weekends / employee.totalDays) * 100)}%
                  </small>
                </div>
                
                {/* Podrobnosti směn */}
                {selectedEmployee === employee.name && (
                  <details>
                    <summary>Podrobnosti směn ({employee.totalDays})</summary>
                    <ul>
                      {employee.shifts
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .map((shift, idx) => {
                          const date = new Date(shift.date);
                          const dayOfWeek = date.getDay();
                          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                          
                          return (
                            <li key={idx}>
                              {shift.date} 
                              {isWeekend && ' (víkend)'}
                              {shift.station && ` - ${shift.station}`}
                            </li>
                          );
                        })}
                    </ul>
                  </details>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
      
      {/* Návod */}
      <section>
        <h3>Jak používat</h3>
        <ol>
          <li>Klikněte na zaměstnance pro zvýraznění jeho směn</li>
          <li>V kalendáři uvidíte 🔆 na dnech kdy pracuje</li>
          <li>Klikněte znovu pro zrušení zvýraznění</li>
          <li>Přepněte na kalendář pro zobrazení dat</li>
        </ol>
      </section>
      
      {/* Akční tlačítka */}
      <footer>
        <button onClick={onBackToCalendar}>
          📅 Zobrazit kalendář
        </button>
        {selectedEmployee && (
          <button onClick={() => onEmployeeSelect(null)}>
            ❌ Zrušit zvýraznění
          </button>
        )}
      </footer>
    </aside>
  );
} 
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
    <aside className="w-full max-w-md bg-background border-l border-border h-full overflow-y-auto">
      <header className="sticky top-0 bg-background border-b border-border p-6">
        <button 
          onClick={onBackToCalendar}
          className="text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          ← Zpět na kalendář
        </button>
        <h2 className="text-heading flex items-center gap-2">
          <span>👥</span>
          Zaměstnanci - {monthName} {year}
        </h2>
      </header>
      
      {/* Celkové statistiky */}
      <section className="p-6 border-b border-border">
        <h3 className="font-medium mb-3">Přehled měsíce</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Celkem zaměstnanců:</span>
            <span className="font-medium">{employeeStats.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Celkem směn:</span>
            <span className="font-medium">{employeeStats.reduce((sum, emp) => sum + emp.totalDays, 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Víkendové směny:</span>
            <span className="font-medium">{employeeStats.reduce((sum, emp) => sum + emp.weekends, 0)}</span>
          </div>
        </div>
      </section>
      
      {/* Seznam zaměstnanců */}
      <section className="p-6">
        <h3 className="font-medium mb-4">Zaměstnanci</h3>
        {selectedEmployee && (
          <div className="mb-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm">
              Zvýrazněno: <strong>{selectedEmployee}</strong>
            </p>
            <button 
              onClick={() => onEmployeeSelect(null)}
              className="text-sm text-primary hover:underline mt-1"
            >
              Zrušit zvýraznění
            </button>
          </div>
        )}
        
        {employeeStats.length === 0 ? (
          <p className="text-muted-foreground text-sm">Žádní zaměstnanci v tomto měsíci</p>
        ) : (
          <div className="space-y-3">
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
                className={`
                  p-4 rounded-lg border cursor-pointer transition-all
                  ${selectedEmployee === employee.name 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  }
                `}
              >
                <header className="mb-3">
                  <h4 className="font-medium flex items-center gap-2">
                    {employee.name}
                    {selectedEmployee === employee.name && <span className="text-primary">🔆</span>}
                  </h4>
                  {employee.station && (
                    <p className="text-sm text-muted-foreground">Pozice: {employee.station}</p>
                  )}
                </header>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground">Celkem</p>
                    <p className="font-medium">{employee.totalDays}</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground">Všední</p>
                    <p className="font-medium">{employee.weekdays}</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground">Víkendy</p>
                    <p className="font-medium">{employee.weekends}</p>
                  </div>
                </div>
                
                {/* Progress indikátor */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Víkendy</span>
                    <span>{Math.round((employee.weekends / employee.totalDays) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary/50 transition-all"
                      style={{ width: `${(employee.weekends / employee.totalDays) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Podrobnosti směn */}
                {selectedEmployee === employee.name && (
                  <details className="mt-3">
                    <summary className="text-sm text-primary cursor-pointer hover:underline">
                      Podrobnosti směn ({employee.totalDays})
                    </summary>
                    <ul className="mt-2 space-y-1 text-sm">
                      {employee.shifts
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .map((shift, idx) => {
                          const date = new Date(shift.date);
                          const dayOfWeek = date.getDay();
                          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                          
                          return (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="text-muted-foreground">{shift.date}</span>
                              {isWeekend && <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded">víkend</span>}
                              {shift.station && <span className="text-xs text-muted-foreground">- {shift.station}</span>}
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
      <section className="p-6 border-t border-border">
        <h3 className="font-medium mb-3">Jak používat</h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li>1. Klikněte na zaměstnance pro zvýraznění jeho směn</li>
          <li>2. V kalendáři uvidíte 🔆 na dnech kdy pracuje</li>
          <li>3. Klikněte znovu pro zrušení zvýraznění</li>
          <li>4. Přepněte na kalendář pro zobrazení dat</li>
        </ol>
      </section>
      
      {/* Akční tlačítka */}
      <footer className="p-6 border-t border-border space-y-3">
        <button 
          onClick={onBackToCalendar}
          className="w-full btn-primary"
        >
          📅 Zobrazit kalendář
        </button>
        {selectedEmployee && (
          <button 
            onClick={() => onEmployeeSelect(null)}
            className="w-full btn-secondary"
          >
            ❌ Zrušit zvýraznění
          </button>
        )}
      </footer>
    </aside>
  );
} 
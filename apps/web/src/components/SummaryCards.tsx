'use client';

import type { PayrollSummary, WorkEntry } from '@/types/payroll';

interface SummaryCardsProps {
  workEntries: WorkEntry[];
}

export function SummaryCards({ workEntries }: SummaryCardsProps) {
  const totalHours = workEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalTips = workEntries.reduce((sum, entry) => sum + entry.tips, 0);
  const totalBonus = workEntries.reduce((sum, entry) => sum + entry.bonus, 0);
  const totalEmployees = new Set(workEntries.map(entry => entry.employeeId)).size;

  const stats = [
    { 
      title: 'Odpracované hodiny',
      value: totalHours,
      suffix: 'hodin',
      description: 'Celkový počet odpracovaných hodin'
    },
    { 
      title: 'Spropitné',
      value: totalTips.toLocaleString('cs-CZ'),
      suffix: 'Kč',
      description: 'Celková částka spropitného'
    },
    { 
      title: 'Bonusy',
      value: totalBonus.toLocaleString('cs-CZ'),
      suffix: 'Kč',
      description: 'Součet všech bonusových plateb'
    },
    { 
      title: 'Celkové náklady',
      value: (totalTips + totalBonus).toLocaleString('cs-CZ'),
      suffix: 'Kč',
      description: 'Součet spropitného a bonusů'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-medium mb-1">Přehled měsíce</h3>
          <p className="text-sm text-muted-foreground">
            Statistiky pro {totalEmployees} {
              totalEmployees === 1 ? 'zaměstnance' : 
              totalEmployees < 5 ? 'zaměstnance' : 
              'zaměstnanců'
            }
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6">
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">{stat.title}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-semibold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.suffix}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
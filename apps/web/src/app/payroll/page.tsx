'use client';

import { useState } from 'react';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { MonthSwitcher } from '@/components/MonthSwitcher';
import { RoleBasedWorkEntryTable } from '@/components/RoleBasedWorkEntryTable';
import { SummaryCards } from '@/components/SummaryCards';
import { ShiftImportDialog } from '@/components/ShiftImportDialog';
import { PermissionGate } from '@/components/PermissionGate';

export default function PayrollPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<'evidence' | 'summary'>('evidence');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [workEntries, setWorkEntries] = useState([]);

  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleDataChange = (newData: any) => {
    setWorkEntries(newData);
  };

  const handleImport = async (file: File) => {
    // Import logika zde
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Payroll Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Správa směn a mezd s role-based přístupem
              </p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <RoleSwitcher />
              <MonthSwitcher 
                currentMonth={currentMonth}
                currentYear={currentYear}
                onMonthChange={handleMonthChange}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Tabs */}
        <div className="mb-8 border-b border-border">
          <div className="flex h-10 items-center space-x-4 text-sm">
            <button
              onClick={() => setActiveTab('evidence')}
              className={`relative h-10 px-4 font-medium transition-colors hover:text-foreground ${
                activeTab === 'evidence'
                  ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Evidence směn
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`relative h-10 px-4 font-medium transition-colors hover:text-foreground ${
                activeTab === 'summary'
                  ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Přehledy
            </button>
          </div>
        </div>

        {/* Import Section */}
        <PermissionGate permission="canImportData">
          <div className="mb-8">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-medium">Import dat</h3>
                  <p className="text-sm text-muted-foreground">
                    Nahrajte Excel soubor se směnami
                  </p>
                </div>
                <button 
                  onClick={() => setIsImportOpen(true)}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Vybrat soubor
                </button>
              </div>
            </div>
          </div>
        </PermissionGate>

        {/* Content */}
        {activeTab === 'evidence' && (
          <div className="rounded-lg border border-border bg-card">
            <div className="p-1">
              <RoleBasedWorkEntryTable 
                data={workEntries} 
                onDataChange={handleDataChange}
              />
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <PermissionGate 
            permission="canViewAll"
            fallback={
              <div className="rounded-lg border border-border bg-card p-6 text-center">
                <h3 className="text-lg font-medium mb-2">Omezený přístup</h3>
                <p className="text-sm text-muted-foreground">
                  Pro zobrazení přehledů potřebujete vyšší oprávnění.
                </p>
              </div>
            }
          >
            <SummaryCards workEntries={workEntries} />
          </PermissionGate>
        )}

        {/* Dialogs */}
        <PermissionGate permission="canImportData">
          <ShiftImportDialog
            isOpen={isImportOpen}
            onClose={() => setIsImportOpen(false)}
            onImport={handleImport}
          />
        </PermissionGate>
      </main>
    </div>
  );
} 
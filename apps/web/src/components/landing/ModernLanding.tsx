import Link from 'next/link';

export function ModernLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-semibold tracking-tight mb-4">
            Edward-Kalendář
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Profesionální kalendářová aplikace pro správu francouzských událostí a plánování
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Levá sekce */}
          <div>
            <h2 className="text-2xl font-medium mb-6">
              Efektivní správa času a mezd
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Kompletní řešení pro plánování směn, evidenci docházky a správu mezd.
                Vše na jednom místě, přehledně a efektivně.
              </p>
              <p>
                Aplikace je navržena pro maximální přehlednost a jednoduchost použití.
                Bez zbytečných funkcí, které nepotřebujete.
              </p>
            </div>
          </div>

          {/* Pravá sekce */}
          <div className="space-y-8">
            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4">Payroll Dashboard</h3>
              <p className="text-muted-foreground mb-6">
                Správa mezd, evidence směn a automatické výpočty. Vše s podporou role-based přístupu.
              </p>
              <Link href="/payroll">
                <button className="btn-primary w-full">
                  Otevřít Payroll
                </button>
              </Link>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium mb-4">Kalendář</h3>
              <p className="text-muted-foreground mb-6">
                Přehledný kalendář s českými a německými svátky, kulturními akcemi a směnami.
              </p>
              <Link href="/calendar">
                <button className="btn-secondary w-full">
                  Zobrazit Kalendář
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="p-6 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Intuitivní rozhraní</h3>
            <p className="text-sm text-muted-foreground">
              Čisté a přehledné uživatelské rozhraní pro snadnou orientaci
            </p>
          </div>
          
          <div className="p-6 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Role-based přístup</h3>
            <p className="text-sm text-muted-foreground">
              Různé úrovně oprávnění pro různé role uživatelů
            </p>
          </div>
          
          <div className="p-6 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Automatizace</h3>
            <p className="text-sm text-muted-foreground">
              Automatické výpočty mezd a statistik
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Edward-Kalendář v2 — Profesionální řešení pro správu času a mezd
            </p>
            <div className="flex gap-6">
              <Link href="/payroll" className="text-sm text-muted-foreground hover:text-foreground">
                Payroll
              </Link>
              <Link href="/calendar" className="text-sm text-muted-foreground hover:text-foreground">
                Kalendář
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 
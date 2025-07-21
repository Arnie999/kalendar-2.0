import Link from 'next/link';

export function MinimalLanding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <h1 className="text-lg font-medium">Edward-Kalendář</h1>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="text-5xl font-light mb-8 tracking-tight">
          Jednoduché plánování
        </h1>
        <p className="text-lg text-muted-foreground mb-16 leading-relaxed">
          Kalendářová aplikace pro správu francouzských událostí.<br />
          Čisté rozhraní, efektivní funkce.
        </p>
        
        <div className="space-y-4">
          <Link href="/payroll">
            <button className="w-full max-w-xs mx-auto block py-4 bg-foreground text-background 
                             font-medium transition-opacity hover:opacity-90">
              Payroll Dashboard
            </button>
          </Link>
          <Link href="/calendar">
            <button className="w-full max-w-xs mx-auto block py-4 border border-border 
                             font-medium hover:bg-muted transition-colors">
              Kalendář
            </button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Payroll</h3>
            <p className="text-muted-foreground leading-relaxed">
              Správa směn, mezd a spropitného. Přehledné výpočty a statistiky 
              pro efektivní finanční plánování.
            </p>
            <Link href="/payroll" className="inline-block text-sm border-b border-foreground">
              Přejít na Payroll
            </Link>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Kalendář</h3>
            <p className="text-muted-foreground leading-relaxed">
              Kulturní akce, svátky a směny v jednom přehledném kalendáři. 
              Plánujte a organizujte svůj čas efektivně.
            </p>
            <Link href="/calendar" className="inline-block text-sm border-b border-foreground">
              Otevřít Kalendář
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-32">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-sm text-muted-foreground">
            Edward-Kalendář v2
          </p>
        </div>
      </footer>
    </div>
  );
} 
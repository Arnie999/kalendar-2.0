import Link from 'next/link';

export function ClassicLanding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Edward-Kalendář</h1>
              <p className="text-sm text-muted-foreground">Profesionální systém pro správu času</p>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/payroll" className="text-foreground hover:text-primary transition-colors">
                Payroll
              </Link>
              <Link href="/calendar" className="text-foreground hover:text-primary transition-colors">
                Kalendář
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-6">
            Komplexní řešení pro správu směn a plánování
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Edward-Kalendář v2 je profesionální nástroj určený pro efektivní správu 
            francouzských kulturních událostí, směn a mzdové agendy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/payroll">
              <button className="px-10 py-4 bg-primary text-primary-foreground font-semibold 
                               rounded-md shadow-md hover:shadow-lg transition-shadow">
                Spustit Payroll Dashboard
              </button>
            </Link>
            <Link href="/calendar">
              <button className="px-10 py-4 bg-secondary text-secondary-foreground font-semibold 
                               rounded-md border border-border hover:bg-secondary/80 transition-colors">
                Zobrazit Kalendář
              </button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12">Klíčové funkce</h3>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Payroll Feature */}
            <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold mb-3">Payroll Dashboard</h4>
                  <p className="text-muted-foreground mb-6">
                    Komplexní správa směn, výpočet mezd a spropitného. Automatizované sestavy, 
                    přehledy výdělků a detailní analýza pracovní doby pro jednotlivé zaměstnance.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Automatické výpočty mezd</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Evidence spropitného</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Detailní reporty</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Feature */}
            <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold mb-3">Inteligentní Kalendář</h4>
                  <p className="text-muted-foreground mb-6">
                    Přehledný kalendář integrující kulturní akce, francouzské svátky a pracovní směny. 
                    Efektivní plánování s podporou více zobrazení a pokročilých filtrů.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-accent rounded-full"></span>
                      <span>Francouzské kulturní události</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-accent rounded-full"></span>
                      <span>Správa směn a prázdnin</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-accent rounded-full"></span>
                      <span>Měsíční a týdenní pohledy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-muted rounded-xl p-12">
          <h3 className="text-2xl font-bold mb-4">Připraveni začít?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Vyberte si aplikaci podle vašich aktuálních potřeb. Obě jsou plně integrované 
            a navržené pro maximální produktivitu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/payroll">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-md 
                               font-medium hover:opacity-90 transition-opacity">
                Začít s Payroll →
              </button>
            </Link>
            <Link href="/calendar">
              <button className="px-8 py-3 bg-background text-foreground border border-border 
                               rounded-md font-medium hover:bg-muted transition-colors">
                Prozkoumat Kalendář →
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h4 className="font-semibold mb-2">Edward-Kalendář v2</h4>
            <p className="text-sm text-muted-foreground">
              Profesionální systém pro správu směn a mzdy © 2024
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface WeatherWidgetProps {
  city?: string;
  apiKey?: string;
}

export function WeatherWidget({ city = 'Mariánské Lázně', apiKey }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funkce pro načtení počasí z OpenWeather API
  const fetchWeather = async () => {
    if (!apiKey) {
      setError('API klíč pro OpenWeather není nastaven');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=cs`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setWeather({
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při načítání počasí');
    } finally {
      setLoading(false);
    }
  };

  // Automatické načtení počasí při mount komponenty (pouze pokud je API klíč)
  useEffect(() => {
    if (apiKey) {
      fetchWeather();
    }
  }, [apiKey, city]);

  return (
    <section className="card">
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-heading">Počasí - {city}</h3>
        <button 
          onClick={fetchWeather} 
          disabled={loading || !apiKey}
          className="btn-secondary text-sm disabled:opacity-50"
        >
          {loading ? 'Načítám...' : 'Obnovit počasí'}
        </button>
      </header>

      {/* Stav bez API klíče */}
      {!apiKey && (
        <div className="space-y-4">
          <h4 className="font-medium text-primary">Připraveno pro OpenWeather API</h4>
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium">Nastavení:</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Lokace: {city}, CZ</li>
              <li>• API: OpenWeatherMap</li>
              <li>• Funkce: aktuální počasí + 5-denní předpověď</li>
              <li>• Jednotky: metrické (°C, m/s)</li>
              <li>• Jazyk: čeština</li>
            </ul>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Demo data:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>Teplota: <span className="font-medium">22°C</span></p>
              <p>Počasí: <span className="font-medium">Polojasno</span></p>
              <p>Vlhkost: <span className="font-medium">65%</span></p>
              <p>Vítr: <span className="font-medium">2.5 m/s</span></p>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium mb-2">Pro aktivaci:</p>
            <ol className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>1. Zaregistrujte se na <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenWeatherMap</a></li>
              <li>2. Získejte API klíč zdarma</li>
              <li>3. Nastavte environment variable NEXT_PUBLIC_OPENWEATHER_API_KEY</li>
              <li>4. Restartujte aplikaci</li>
            </ol>
          </div>
        </div>
      )}

      {/* Chyba při načítání */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <h4 className="font-medium text-destructive mb-1">Chyba</h4>
          <p className="text-sm text-destructive">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">Zkontrolujte internetové připojení nebo platnost API klíče.</p>
        </div>
      )}

      {/* Načítání */}
      {loading && (
        <div className="text-center py-8">
          <h4 className="text-sm font-medium mb-1">Načítám aktuální počasí...</h4>
          <p className="text-xs text-muted-foreground">Připojujem se k OpenWeather API</p>
        </div>
      )}

      {/* Zobrazení počasí */}
      {weather && !loading && (
        <div className="space-y-4">
          <h4 className="font-medium">Aktuální počasí</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-semibold">{weather.temperature}°C</span>
              {weather.icon && (
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  width="50"
                  height="50"
                  className="opacity-80"
                />
              )}
            </div>
            <p className="text-muted-foreground capitalize">{weather.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-muted/30 rounded-md p-3">
              <p className="text-xs text-muted-foreground">Vlhkost</p>
              <p className="font-medium">{weather.humidity}%</p>
            </div>
            <div className="bg-muted/30 rounded-md p-3">
              <p className="text-xs text-muted-foreground">Vítr</p>
              <p className="font-medium">{weather.windSpeed} m/s</p>
            </div>
          </div>

          <small className="text-muted-foreground block">
            Aktualizováno: {new Date().toLocaleTimeString('cs-CZ')}
          </small>
        </div>
      )}

      {/* Placeholder pro 5-denní předpověď */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="font-medium mb-3">5-denní předpověď</h4>
        <p className="text-sm text-muted-foreground mb-4">Připraveno pro rozšíření - bude zobrazovat předpověď na příštích 5 dní</p>
        
        {/* Demo struktura */}
        <div className="bg-muted/20 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-2">Demo struktura:</p>
          <div className="grid gap-2">
            <div className="flex justify-between text-sm">
              <span>Dnes</span>
              <span className="font-medium">22°C, polojasno</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Zítra</span>
              <span className="font-medium">20°C, déšť</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pozítří</span>
              <span className="font-medium">18°C, oblačno</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>+3 dny</span>
              <span className="font-medium">25°C, jasno</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>+4 dny</span>
              <span className="font-medium">23°C, polojasno</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
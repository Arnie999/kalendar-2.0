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
    <section>
      <header>
        <h3>Počasí - {city}</h3>
        <button 
          onClick={fetchWeather} 
          disabled={loading || !apiKey}
        >
          {loading ? 'Načítám...' : 'Obnovit počasí'}
        </button>
      </header>

      {/* Stav bez API klíče */}
      {!apiKey && (
        <div>
          <h4>Připraveno pro OpenWeather API</h4>
          <div>
            <p><strong>Nastavení:</strong></p>
            <ul>
              <li>Lokace: {city}, CZ</li>
              <li>API: OpenWeatherMap</li>
              <li>Funkce: aktuální počasí + 5-denní předpověď</li>
              <li>Jednotky: metrické (°C, m/s)</li>
              <li>Jazyk: čeština</li>
            </ul>
          </div>
          
          <div>
            <p><strong>Demo data:</strong></p>
            <div>
              <p>Teplota: 22°C</p>
              <p>Počasí: Polojasno</p>
              <p>Vlhkost: 65%</p>
              <p>Vítr: 2.5 m/s</p>
            </div>
          </div>

          <div>
            <p><strong>Pro aktivaci:</strong></p>
            <ol>
              <li>Zaregistrujte se na <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a></li>
              <li>Získejte API klíč zdarma</li>
              <li>Nastavte environment variable NEXT_PUBLIC_OPENWEATHER_API_KEY</li>
              <li>Restartujte aplikaci</li>
            </ol>
          </div>
        </div>
      )}

      {/* Chyba při načítání */}
      {error && (
        <div>
          <h4>Chyba</h4>
          <p>{error}</p>
          <p>Zkontrolujte internetové připojení nebo platnost API klíče.</p>
        </div>
      )}

      {/* Načítání */}
      {loading && (
        <div>
          <h4>Načítám aktuální počasí...</h4>
          <p>Připojujem se k OpenWeather API</p>
        </div>
      )}

      {/* Zobrazení počasí */}
      {weather && !loading && (
        <div>
          <h4>Aktuální počasí</h4>
          <div>
            <div>
              <span>{weather.temperature}°C</span>
              {weather.icon && (
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  width="50"
                  height="50"
                />
              )}
            </div>
            <p>{weather.description}</p>
          </div>
          
          <div>
            <div>
              <strong>Vlhkost:</strong> {weather.humidity}%
            </div>
            <div>
              <strong>Vítr:</strong> {weather.windSpeed} m/s
            </div>
          </div>

          <small>
            Aktualizováno: {new Date().toLocaleTimeString('cs-CZ')}
          </small>
        </div>
      )}

      {/* Placeholder pro 5-denní předpověď */}
      <div>
        <h4>5-denní předpověď</h4>
        <p>Připraveno pro rozšíření - bude zobrazovat předpověď na příštích 5 dní</p>
        
        {/* Demo struktura */}
        <div>
          <small>Demo struktura:</small>
          <ul>
            <li>Dnes: 22°C, polojasno</li>
            <li>Zítra: 20°C, déšť</li>
            <li>Pozítří: 18°C, oblačno</li>
            <li>+3 dny: 25°C, jasno</li>
            <li>+4 dny: 23°C, polojasno</li>
          </ul>
        </div>
      </div>
    </section>
  );
} 
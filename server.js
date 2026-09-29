import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Enable gzip compression for faster layer/asset loading
app.use(compression());

// In-memory cache for NTT weather data (10 minutes TTL)
let weatherCache = {
  timestamp: 0,
  data: null
};

const NTT_LOCATIONS = [
  { name: 'Alor', ibuKota: 'Kalabahi', lat: -8.2886, lon: 124.67543 },
  { name: 'Belu', ibuKota: 'Atambua', lat: -9.18223, lon: 124.94818 },
  { name: 'Ende', ibuKota: 'Ende', lat: -8.64465, lon: 121.67207 },
  { name: 'Flores Timur', ibuKota: 'Larantuka', lat: -8.34078, lon: 122.84126 },
  { name: 'Kota Kupang', ibuKota: 'Kupang', lat: -10.20197, lon: 123.61477 },
  { name: 'Kupang', ibuKota: 'Oelamasi', lat: -10.0041, lon: 123.79644 },
  { name: 'Lembata', ibuKota: 'Lewoleba', lat: -8.35557, lon: 123.5534 },
  { name: 'Malaka', ibuKota: 'Betun', lat: -9.50104, lon: 124.82253 },
  { name: 'Manggarai', ibuKota: 'Ruteng', lat: -8.53733, lon: 120.40529 },
  { name: 'Manggarai Barat', ibuKota: 'Labuan Bajo', lat: -8.55642, lon: 120.08966 },
  { name: 'Manggarai Timur', ibuKota: 'Borong', lat: -8.55879, lon: 120.729 },
  { name: 'Nagekeo', ibuKota: 'Mbay', lat: -8.63679, lon: 121.33852 },
  { name: 'Ngada', ibuKota: 'Bajawa', lat: -8.576, lon: 120.9879 },
  { name: 'Rote Ndao', ibuKota: 'Baa', lat: -10.69503, lon: 123.1742 },
  { name: 'Sabu Raijua', ibuKota: 'Menia', lat: -10.54938, lon: 121.85958 },
  { name: 'Sikka', ibuKota: 'Maumere', lat: -8.63245, lon: 122.19349 },
  { name: 'Sumba Barat', ibuKota: 'Waikabubak', lat: -9.63715, lon: 119.36743 },
  { name: 'Sumba Barat Daya', ibuKota: 'Tambolaka', lat: -9.56188, lon: 119.15612 },
  { name: 'Sumba Tengah', ibuKota: 'Waibakul', lat: -9.58437, lon: 119.64249 },
  { name: 'Sumba Timur', ibuKota: 'Waingapu', lat: -9.93044, lon: 120.19704 },
  { name: 'Timor Tengah Selatan', ibuKota: 'Soe', lat: -9.69698, lon: 124.43382 },
  { name: 'Timor Tengah Utara', ibuKota: 'Kefamenanu', lat: -9.40011, lon: 124.54786 }
];

// Weather interpretation table (WMO Weather interpretation codes)
function getWeatherDesc(code) {
  switch (code) {
    case 0: return { text: 'Cerah', icon: '☀️', iconClass: 'fa-sun text-amber-400' };
    case 1: return { text: 'Cerah Berawan', icon: '🌤️', iconClass: 'fa-cloud-sun text-amber-300' };
    case 2: return { text: 'Sebagian Berawan', icon: '⛅', iconClass: 'fa-cloud-sun text-sky-300' };
    case 3: return { text: 'Berawan Tebal', icon: '☁️', iconClass: 'fa-cloud text-slate-400' };
    case 45:
    case 48: return { text: 'Berkabut / Halimun', icon: '🌫️', iconClass: 'fa-smog text-slate-400' };
    case 51: return { text: 'Gerimis Ringan', icon: '🌦️', iconClass: 'fa-cloud-rain text-sky-400' };
    case 53: return { text: 'Gerimis Sedang', icon: '🌦️', iconClass: 'fa-cloud-rain text-sky-400' };
    case 55: return { text: 'Gerimis Lebat', icon: '🌧️', iconClass: 'fa-cloud-showers-heavy text-sky-500' };
    case 61: return { text: 'Hujan Ringan', icon: '🌧️', iconClass: 'fa-cloud-rain text-sky-400' };
    case 63: return { text: 'Hujan Sedang', icon: '🌧️', iconClass: 'fa-cloud-showers-heavy text-sky-500' };
    case 65: return { text: 'Hujan Lebat', icon: '🌧️', iconClass: 'fa-cloud-showers-heavy text-blue-500' };
    case 80: return { text: 'Hujan Lokal Ringan', icon: '🌦️', iconClass: 'fa-cloud-sun-rain text-sky-400' };
    case 81: return { text: 'Hujan Guyur Sedang', icon: '🌧️', iconClass: 'fa-cloud-showers-heavy text-sky-500' };
    case 82: return { text: 'Hujan Deras / Badai', icon: '⛈️', iconClass: 'fa-bolt text-amber-400' };
    case 95: return { text: 'Hujan Badai Petir', icon: '⛈️', iconClass: 'fa-bolt text-amber-400' };
    case 96:
    case 99: return { text: 'Badai Petir & Petir Kuat', icon: '⛈️', iconClass: 'fa-bolt text-rose-500' };
    default: return { text: 'Cerah Berawan', icon: '🌤️', iconClass: 'fa-cloud-sun text-sky-300' };
  }
}

// Convert wind degrees to cardinal direction (Indonesian)
function getWindDirectionText(degrees) {
  const dirs = [
    'Utara', 'Timur Laut', 'Timur', 'Tenggara',
    'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'
  ];
  const idx = Math.round(((degrees % 360) / 45)) % 8;
  return dirs[idx];
}

// Public Weather API Proxy endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const now = Date.now();
    // Return cached data if less than 10 minutes old
    if (weatherCache.data && (now - weatherCache.timestamp) < 10 * 60 * 1000) {
      return res.json({
        cached: true,
        updatedAt: new Date(weatherCache.timestamp).toISOString(),
        locations: weatherCache.data
      });
    }

    const lats = NTT_LOCATIONS.map(l => l.lat).join(',');
    const lons = NTT_LOCATIONS.map(l => l.lon).join(',');
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FMakassar`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo returned status ${response.status}`);
    }

    const rawData = await response.json();
    const results = [];

    // If single location returned as object instead of array
    const dataList = Array.isArray(rawData) ? rawData : [rawData];

    NTT_LOCATIONS.forEach((loc, i) => {
      const item = dataList[i];
      if (!item || !item.current) {
        return;
      }

      const curr = item.current;
      const daily = item.daily || {};
      const weatherInfo = getWeatherDesc(curr.weather_code);
      const windDirText = getWindDirectionText(curr.wind_direction_10m || 0);

      // Format 5-day daily forecast
      const forecastDays = [];
      if (daily.time && Array.isArray(daily.time)) {
        for (let d = 0; d < Math.min(5, daily.time.length); d++) {
          const code = daily.weather_code ? daily.weather_code[d] : curr.weather_code;
          forecastDays.push({
            date: daily.time[d],
            weatherCode: code,
            weatherDesc: getWeatherDesc(code).text,
            icon: getWeatherDesc(code).icon,
            iconClass: getWeatherDesc(code).iconClass,
            tempMax: daily.temperature_2m_max ? Math.round(daily.temperature_2m_max[d]) : null,
            tempMin: daily.temperature_2m_min ? Math.round(daily.temperature_2m_min[d]) : null,
            precipProb: daily.precipitation_probability_max ? daily.precipitation_probability_max[d] : 0,
            windMax: daily.wind_speed_10m_max ? Math.round(daily.wind_speed_10m_max[d]) : null
          });
        }
      }

      results.push({
        name: loc.name,
        ibuKota: loc.ibuKota,
        lat: loc.lat,
        lon: loc.lon,
        temperature: Math.round(curr.temperature_2m * 10) / 10,
        feelsLike: Math.round(curr.apparent_temperature * 10) / 10,
        humidity: curr.relative_humidity_2m,
        precipitation: curr.precipitation || 0,
        weatherCode: curr.weather_code,
        weatherText: weatherInfo.text,
        weatherIcon: weatherInfo.icon,
        weatherIconClass: weatherInfo.iconClass,
        windSpeedKmH: Math.round(curr.wind_speed_10m * 10) / 10,
        windDirectionDeg: curr.wind_direction_10m || 0,
        windDirectionText: windDirText,
        isDay: curr.is_day === 1,
        time: curr.time,
        dailyForecast: forecastDays
      });
    });

    weatherCache = {
      timestamp: now,
      data: results
    };

    return res.json({
      cached: false,
      updatedAt: new Date(now).toISOString(),
      locations: results
    });
  } catch (error) {
    console.error('Weather fetch error:', error);
    // If cache exists even if expired, return it as fallback
    if (weatherCache.data) {
      return res.json({
        cached: true,
        stale: true,
        updatedAt: new Date(weatherCache.timestamp).toISOString(),
        locations: weatherCache.data
      });
    }
    return res.status(500).json({ error: 'Failed to fetch weather data', message: error.message });
  }
});

// Serve all static assets from project root
app.use(express.static(__dirname));

// Send index.html for root or unhandled paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

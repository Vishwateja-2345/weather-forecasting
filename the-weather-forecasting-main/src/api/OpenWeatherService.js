const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_GEOCODING_REVERSE =
  'https://geocoding-api.open-meteo.com/v1/reverse';

function mapWmoToDescAndIcon(wmoCode, isDay = 1) {
  const daySuffix = isDay ? 'd' : 'n';
  // Basic WMO to description mapping
  // Source: https://open-meteo.com/en/docs#api_form
  const mapping = {
    0: { description: 'clear sky', icon: `01${daySuffix}` },
    1: { description: 'mainly clear', icon: `02${daySuffix}` },
    2: { description: 'partly cloudy', icon: `03${daySuffix}` },
    3: { description: 'overcast clouds', icon: `04${daySuffix}` },
    45: { description: 'fog', icon: `50${daySuffix}` },
    48: { description: 'depositing rime fog', icon: `50${daySuffix}` },
    51: { description: 'light drizzle', icon: `09${daySuffix}` },
    53: { description: 'moderate drizzle', icon: `09${daySuffix}` },
    55: { description: 'dense drizzle', icon: `09${daySuffix}` },
    56: { description: 'freezing drizzle: light', icon: `09${daySuffix}` },
    57: { description: 'freezing drizzle: dense', icon: `09${daySuffix}` },
    61: { description: 'slight rain', icon: `10${daySuffix}` },
    63: { description: 'moderate rain', icon: `10${daySuffix}` },
    65: { description: 'heavy rain', icon: `10${daySuffix}` },
    66: { description: 'freezing rain: light', icon: `10${daySuffix}` },
    67: { description: 'freezing rain: heavy', icon: `10${daySuffix}` },
    71: { description: 'slight snow fall', icon: `13${daySuffix}` },
    73: { description: 'moderate snow fall', icon: `13${daySuffix}` },
    75: { description: 'heavy snow fall', icon: `13${daySuffix}` },
    77: { description: 'snow grains', icon: `13${daySuffix}` },
    80: { description: 'rain showers: slight', icon: `09${daySuffix}` },
    81: { description: 'rain showers: moderate', icon: `09${daySuffix}` },
    82: { description: 'rain showers: violent', icon: `09${daySuffix}` },
    85: { description: 'snow showers: slight', icon: `13${daySuffix}` },
    86: { description: 'snow showers: heavy', icon: `13${daySuffix}` },
    95: { description: 'thunderstorm', icon: `11${daySuffix}` },
    96: { description: 'thunderstorm with hail: slight', icon: `11${daySuffix}` },
    99: { description: 'thunderstorm with hail: heavy', icon: `11${daySuffix}` },
  };
  return (
    mapping[wmoCode] || { description: 'unknown', icon: `unknown` }
  );
}

export async function fetchWeatherData(lat, lon) {
  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current:
        'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day',
      hourly: 'temperature_2m,relative_humidity_2m,cloud_cover,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max',
      timeformat: 'iso8601',
      timezone: 'auto',
      wind_speed_unit: 'ms',
    });

    const response = await fetch(`${OPEN_METEO_BASE}?${params.toString()}`);
    const data = await response.json();

    const { description, icon } = mapWmoToDescAndIcon(
      data?.current?.weather_code,
      data?.current?.is_day
    );

    // Synthesize an object compatible with UI expectations for current weather
    const currentWeather = {
      cod: 200,
      main: {
        temp: Math.round(data?.current?.temperature_2m ?? 0),
        feels_like: Math.round(data?.current?.apparent_temperature ?? 0),
        humidity: Math.round(data?.current?.relative_humidity_2m ?? 0),
        pressure: Math.round(data?.current?.pressure_msl ?? 0),
      },
      wind: {
        speed: Number(data?.current?.wind_speed_10m ?? 0),
        deg: Number(data?.current?.wind_direction_10m ?? 0),
        gust: Number(data?.current?.wind_gusts_10m ?? 0),
      },
      clouds: {
        all: Math.round(data?.current?.cloud_cover ?? 0),
      },
      weather: [
        {
          description,
          icon, // UI adds .png where needed
        },
      ],
    };

    return [
      currentWeather,
      {
        hourly: data?.hourly || {},
        daily: data?.daily || {},
      },
    ];
  } catch (error) {
    console.log(error);
    return [{}, {}];
  }
}

export async function fetchCities(input) {
  // Not used anymore, kept for compatibility
  return { data: [] };
}

export async function reverseGeocode(lat, lon) {
  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      language: 'en',
      format: 'json',
    });
    const response = await fetch(`${OPEN_METEO_GEOCODING_REVERSE}?${params.toString()}`);
    const data = await response.json();
    if (data && data.results && data.results.length > 0) {
      const item = data.results[0];
      return {
        name: item.name,
        country: item.country_code,
        state: item.admin1,
      };
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

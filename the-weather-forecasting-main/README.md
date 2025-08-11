![Application screenshot](./public/screenshot.png)


With [The Weather Forecasting](https://the-weather-forecasting.netlify.app) you can search locations by city name or use your current location and see the current weather plus a 5–6 day outlook with hourly breakdowns.
The app is built with React and MUI.


## Live Demo

https://the-weather-forecasting.netlify.app


## Getting Started

- Prerequisite: Node.js and npm
- Clone and install:

```bash
git clone https://github.com/Amin-Awinti/the-weather-forecasting.git
cd the-weather-forecasting-main
npm install
npm start
```


## Data sources (Open‑Meteo)

This app now uses the free, open-source Open‑Meteo APIs. No API key is required.
- Weather Forecast API: `https://api.open-meteo.com/v1/forecast`
- Geocoding API: `https://geocoding-api.open-meteo.com/v1`

Attribution required by CC BY 4.0: “Weather data by Open‑Meteo.com”.


## What changed vs. before

- Replaced OpenWeatherMap with Open‑Meteo for current and hourly forecast
- Replaced GeoDB/RapidAPI with Open‑Meteo Geocoding (search and reverse geocode)
- Kept the internal data shape so existing components keep working

Files of interest:
- `src/api/OpenWeatherService.js` — Open‑Meteo integration and mapping
- `src/utilities/ApiService.js` — same integration exposed for utilities
- `scripts/backtest-openmeteo.js` — quick CLI to verify data mapping


## Scripts

- Run dev server:
```bash
npm start
```
- Build production bundle:
```bash
npm run build
```
- Quick backtest (sample coords can be overridden via TEST_LAT/TEST_LON):
```bash
node scripts/backtest-openmeteo.js
# or
TEST_LAT=52.52 TEST_LON=13.41 node scripts/backtest-openmeteo.js
```


## Libraries

- React 18
- MUI (Material UI)


## Todos

- [ ] Styled-components
- [ ] Convert to TypeScript
- [ ] Unit tests
- [ ] Temperature unit toggle (°C/°F)
- [ ] Dark/Light mode


Thanks ☺

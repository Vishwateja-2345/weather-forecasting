## The Weather Forecasting

A lightweight React app to view the current weather and a 6–7 day forecast for any place. You can search by address/city or use your current device location. The UI shows today’s conditions plus a weekly overview.

- Built with React and Material UI
- Weather data by Open‑Meteo
- Geocoding (address ↔ coordinates) by geocode.maps.co


### Live Demo
https://the-weather-forecasting.netlify.app


### Features
- Search locations by city/address (forward geocoding)
- Use device GPS to get your current location (reverse geocoding)
- Current conditions with temperature, humidity, wind, clouds
- Weekly forecast summary


### Tech Stack
- React 18 (Create React App)
- Material UI (MUI)
- Open‑Meteo Forecast API
- geocode.maps.co Geocoding API


### APIs Used
- Weather: `https://api.open-meteo.com/v1/forecast`
- Forward geocode: `https://geocode.maps.co/search?q={address}&api_key={loc_api}`
- Reverse geocode: `https://geocode.maps.co/reverse?lat={latitude}&lon={longitude}&api_key={loc_api}`

Responses are normalized in `src/api/OpenWeatherService.js` so the UI uses a consistent shape.


### Environment Variables
Only one variable is required:
- `loc_api` — your geocode.maps.co API key

On Netlify, add `loc_api` under Site settings → Build & deploy → Environment → Environment variables.
The build process automatically injects this key (see `scripts/inject-loc-api.js`).


### Local Development
1) Requirements: Node.js 18+
2) Install dependencies:
```bash
cd the-weather-forecasting-main
npm install
```
3) (Optional) Export your geocoding key for local runs:
```bash
export loc_api=YOUR_GEOCODE_MAPS_CO_KEY
```
4) Start the dev server:
```bash
npm start
```
5) Build production assets:
```bash
npm run build
```


### Deployment (Netlify)
- Base directory: `the-weather-forecasting-main`
- Build command: `npm run build`
- Publish directory: `build`
- Environment variable: `loc_api`

`netlify.toml` at the repo root is already configured with the correct base, build and publish settings.


### Project Structure
- `netlify.toml` — Netlify config (points to `the-weather-forecasting-main`)
- `the-weather-forecasting-main/`
  - `src/`
    - `api/OpenWeatherService.js` — all API calls and response mapping
    - `components/` — UI components
    - `assets/` — icons and images
    - `config/locApi.js` — auto-generated at build time with your `loc_api`
  - `public/` — static files for CRA
  - `scripts/inject-loc-api.js` — writes `loc_api` into `src/config/locApi.js`


### How It Works
- Clicking “Get Weather Forecast” requests location from the browser (Geolocation API).
- The app reverse‑geocodes the coordinates to a readable place name and displays it under “CURRENT LOCATION”.
- Weather data is fetched from Open‑Meteo using the same coordinates and rendered in the Today and Weekly sections.


### Roadmap
- [ ] Unit tests
- [ ] Temperature unit toggle (°C/°F)
- [ ] Dark/Light theme toggle


### License
This project is provided as‑is for demonstration and learning purposes.
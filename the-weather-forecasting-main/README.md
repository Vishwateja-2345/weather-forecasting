![Application screenshot](./public/screenshot.png)


## The Weather Forecasting

A lightweight React app to get the current weather and a 6–7 day forecast for any location. You can:
- Search by city/address (forward geocoding)
- Use your device location (reverse geocoding)
- See today’s conditions and a week overview

Built with React and Material UI. Weather data is powered by Open‑Meteo; geocoding is powered by geocode.maps.co.


### Live Demo
https://the-weather-forecasting.netlify.app


### Tech stack
- React 18 (Create React App)
- Material UI (MUI)
- Open‑Meteo Forecast API
- geocode.maps.co (forward/reverse geocoding)


### Environment variables
Only one variable is required for geocoding:
- `loc_api` — your geocode.maps.co API key

On Netlify, add it in Site settings → Build & deploy → Environment → Environment variables.
The build process will automatically inject this value so the app can call geocoding endpoints.


### Getting started (local)
1) Prerequisites: Node.js 18+
2) Install dependencies:
```bash
npm install
```
3) Set the env var in your shell before starting (optional if you don’t need geocoding locally):
```bash
export loc_api=YOUR_GEOCODE_MAPS_CO_KEY
```
4) Run the app:
```bash
npm start
```
5) Build for production:
```bash
npm run build
```


### How it works
- Forward geocode: `GET https://geocode.maps.co/search?q={address}&api_key=${loc_api}`
- Reverse geocode: `GET https://geocode.maps.co/reverse?lat={lat}&lon={lon}&api_key=${loc_api}`
- Weather: `GET https://api.open-meteo.com/v1/forecast?...` (current + hourly, then grouped for daily)

The UI shows a “Get Weather Forecast” button to use the browser’s Geolocation API. If permitted, it reverse‑geocodes your coordinates and displays a readable place name under “Current Location.”


### Scripts
- `npm start` — start dev server
- `npm run build` — production build


### Repository layout
- `src/api/OpenWeatherService.js` — API calls and response mapping
- `src/components` — UI components
- `src/assets` — icons and images
- `public` — CRA public assets


### Roadmap
- [ ] Unit tests
- [ ] Temperature unit toggle (°C/°F)
- [ ] Dark/Light theme toggle


Thank you! 😊

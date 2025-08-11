import React, { useState } from 'react';
import { Box, Container, Grid, Link, SvgIcon, Typography } from '@mui/material';
import Search from './components/Search/Search';
import WeeklyForecast from './components/WeeklyForecast/WeeklyForecast';
import TodayWeather from './components/TodayWeather/TodayWeather';
import { fetchWeatherData } from './api/OpenWeatherService';
import UTCDatetime from './components/Reusable/UTCDatetime';
import LoadingBox from './components/Reusable/LoadingBox';
import { ReactComponent as SplashIcon } from './assets/splash-icon.svg';
import Logo from './assets/logo.png';
import ErrorBox from './components/Reusable/ErrorBox';
import GitHubIcon from '@mui/icons-material/GitHub';

function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const searchChangeHandler = async (enteredData) => {
    const [latitude, longitude] = enteredData.value.split(' ');

    setIsLoading(true);

    try {
      const [todayWeatherResponse, forecastPayload] = await fetchWeatherData(
        latitude,
        longitude
      );

      // Build today's hourly forecast items from hourly arrays, starting from next hour
      const nowIso = new Date().toISOString().slice(0, 13); // yyyy-mm-ddThh
      const times = forecastPayload?.hourly?.time || [];
      const temps = forecastPayload?.hourly?.temperature_2m || [];
      let todayItems = [];
      for (let i = 0; i < times.length; i++) {
        if (times[i].startsWith(nowIso)) {
          const timeStr = times[i].split('T')[1].slice(0, 5);
          todayItems.push({ time: timeStr, temperature: Math.round(temps[i]) + ' °C' });
        }
      }
      // Limit to up to 6 items similar to previous behavior
      if (todayItems.length > 6) todayItems = todayItems.slice(0, 6);

      // Build week forecast list from daily arrays, up to 6 days
      const dailyTimes = forecastPayload?.daily?.time || [];
      const dailyTmax = forecastPayload?.daily?.temperature_2m_max || [];
      const dailyTmin = forecastPayload?.daily?.temperature_2m_min || [];
      const dailyWind = forecastPayload?.daily?.wind_speed_10m_max || [];

      const weekList = [];
      for (let i = 0; i < Math.min(6, dailyTimes.length); i++) {
        // Use average of max/min as the "temp" for list item to match expected UI
        const avgTemp = Math.round(((dailyTmax[i] ?? 0) + (dailyTmin[i] ?? 0)) / 2);
        // We do not have humidity and clouds in daily; set placeholders or derive from hourly same day average if needed
        weekList.push({
          date: dailyTimes[i],
          temp: avgTemp,
          humidity: 0,
          wind: typeof dailyWind[i] === 'number' ? dailyWind[i] : 0,
          clouds: 0,
          description: '',
          icon: 'unknown',
        });
      }

      setTodayForecast([...todayItems]);
      setTodayWeather({ city: enteredData.label, ...todayWeatherResponse });
      setWeekForecast({ city: enteredData.label, list: weekList });
    } catch (error) {
      setError(true);
    }

    setIsLoading(false);
  };

  let appContent = (
    <Box
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: '100%',
        minHeight: '500px',
      }}
    >
      <SvgIcon
        component={SplashIcon}
        inheritViewBox
        sx={{ fontSize: { xs: '100px', sm: '120px', md: '140px' } }}
      />
      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontSize: { xs: '12px', sm: '14px' },
          color: 'rgba(255,255,255, .85)',
          fontFamily: 'Poppins',
          textAlign: 'center',
          margin: '2rem 0',
          maxWidth: '80%',
          lineHeight: '22px',
        }}
      >
        Get the current weather and 6-day forecast for your current location.
      </Typography>
    </Box>
  );

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <React.Fragment>
        <Grid item xs={12} md={todayWeather ? 6 : 12}>
          <Grid item xs={12}>
            <TodayWeather data={todayWeather} forecastList={todayForecast} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <WeeklyForecast data={weekForecast} />
        </Grid>
      </React.Fragment>
    );
  }

  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="Something went wrong"
      />
    );
  }

  if (isLoading) {
    appContent = (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '500px',
        }}
      >
        <LoadingBox value="1">
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontSize: { xs: '10px', sm: '12px' },
              color: 'rgba(255, 255, 255, .8)',
              lineHeight: 1,
              fontFamily: 'Poppins',
            }}
          >
            Loading...
          </Typography>
        </LoadingBox>
      </Box>
    );
  }

  return (
    <Container
      sx={{
        maxWidth: { xs: '95%', sm: '80%', md: '1100px' },
        width: '100%',
        height: '100%',
        margin: '0 auto',
        padding: '1rem 0 3rem',
        marginBottom: '1rem',
        borderRadius: {
          xs: 'none',
          sm: '0 0 1rem 1rem',
        },
        boxShadow: {
          xs: 'none',
          sm: 'rgba(0,0,0, 0.5) 0px 10px 15px -3px, rgba(0,0,0, 0.5) 0px 4px 6px -2px',
        },
      }}
    >
      <Grid container columnSpacing={2}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: '100%',
              marginBottom: '1rem',
            }}
          >
            <Box
              component="img"
              sx={{
                height: { xs: '16px', sm: '22px', md: '26px' },
                width: 'auto',
              }}
              alt="logo"
              src={Logo}
            />

            <UTCDatetime />
            <Link
              href="https://github.com/Amin-Awinti"
              target="_blank"
              underline="none"
              sx={{ display: 'flex' }}
            >
              <GitHubIcon
                sx={{
                  fontSize: { xs: '20px', sm: '22px', md: '26px' },
                  color: 'white',
                  '&:hover': { color: '#2d95bd' },
                }}
              />
            </Link>
          </Box>
          <Search onSearchChange={searchChangeHandler} />
        </Grid>
        {appContent}
      </Grid>
    </Container>
  );
}

export default App;

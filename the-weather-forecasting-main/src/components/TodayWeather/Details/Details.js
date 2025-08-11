import React from 'react';
import { Grid, Typography } from '@mui/material';
import { getDayMonthFromDate } from '../../../utilities/DatetimeUtils';
import { weatherIcon } from '../../../utilities/IconsUtils';
import ErrorBox from '../../Reusable/ErrorBox';
import CityDateDetail from './CityDateDetail';
import TemperatureWeatherDetail from './TemperatureWeatherDetail';
import WeatherIconDetail from './WeatherIconDetail';
import Layout from '../../Reusable/Layout';

const dayMonth = getDayMonthFromDate();

const Details = ({ data }) => {
  const noDataProvided =
    !data || Object.keys(data).length === 0 || data.cod === '404';

  let content = <ErrorBox flex="1" type="error" />;

  if (!noDataProvided)
    content = (
      <>
        <Grid
          item
          xs={4}
          sx={{
            height: '80px',
          }}
        >
          <CityDateDetail city={data.city} date={dayMonth} />
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            height: '80px',
          }}
        >
          <TemperatureWeatherDetail
            temperature={data.main.temp}
            description={data.weather[0].description}
          />
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80px',
          }}
        >
          <WeatherIconDetail src={weatherIcon(`${data.weather[0].icon}.png`)} />
        </Grid>
      </>
    );

  const sectionSubHeader = !noDataProvided ? (
    <Typography
      variant="subtitle2"
      component="div"
      sx={{
        textAlign: 'center',
        color: 'rgba(255,255,255,.6)',
        marginBottom: '0.5rem',
        fontFamily: 'Roboto Condensed',
        fontSize: { xs: '10px', sm: '12px' },
      }}
    >
      {data.city}
    </Typography>
  ) : null;

  return <Layout title="CURRENT WEATHER" content={content} sectionSubHeader={sectionSubHeader} />;
};

export default Details;

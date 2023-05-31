import React from 'react';
import { useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';

import { LineController, CategoryScale } from 'chart.js';
Chart.register(LineController, CategoryScale);

const useStyles = makeStyles({
  card: {
    maxWidth: 400,
    margin: 'auto',
    marginTop: 20,
    padding: 20,
    textAlign: 'center',
    backgroundImage: 'linear-gradient(to bottom, #ffffff, #fafafa, #f5f5f5, #f0f0f0, #ebebeb)',
  },
  chartContainer: {
    marginTop: 20,
    width: '100%',
  },
});

const WeatherCard = ({ date, temp, condition, iconCode, chartData, index, tout }) => {
  const classes = useStyles();
  const [selectedOption, setSelectedOption] = useState('temperature');

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const getChartData = () => {
    if (chartData) {
      let data;
      let label;

      switch (selectedOption) {
        case 'temperature':
          data = chartData.forecast.forecastday[index].hour.map((hour) => hour.temp_c);
          label = 'Temperature';
          break;
        case 'humidite':
          data = chartData.forecast.forecastday[index].hour.map((hour) => hour.humidity);
          label = 'Humidité';
          break;
        case 'vent':
          data = chartData.forecast.forecastday[index].hour.map((hour) => hour.wind_kph);
          label = 'Vent';
          break;
        default:
          return null;
      }

      const labels = chartData.forecast.forecastday[index].hour.map((hour) => hour.time);

      return {
        labels,
        datasets: [
          {
            label,
            data,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      };
    }

    return null;
  };

  if (index!=-1) {
    const tmp_date = new Date(date);
    const options = { weekday: 'long' };
    const jourSemaine = tmp_date.toLocaleDateString('fr-FR', options);

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" color="black" component="h2" gutterBottom>
            {jourSemaine}
          </Typography>
          <img src={iconCode} alt={condition} />
          <Typography variant="h6" color="black">
            {chartData.forecast.forecastday[index].day.mintemp_c} - {chartData.forecast.forecastday[index].day.maxtemp_c} °C
          </Typography>
          <Typography variant="body1" color="black" component="p">
            {condition}
          </Typography>
        </CardContent>
  
        <div className={classes.buttonContainer}>
          <Button
            onClick={() => handleOptionChange('temperature')}
            variant={selectedOption === 'temperature' ? 'contained' : 'outlined'}
          >
            Temperature
          </Button>
          <Button
            onClick={() => handleOptionChange('vent')}
            variant={selectedOption === 'vent' ? 'contained' : 'outlined'}
          >
            Vent
          </Button>
          <Button
            onClick={() => handleOptionChange('humidite')}
            variant={selectedOption === 'humidite' ? 'contained' : 'outlined'}
          >
            Humidité
          </Button>
        </div>
  
        {chartData && (
          <div className={classes.chartContainer}>
            <Line
              data={getChartData()}
              options={{
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    beginAtZero: true,
                    suggestedMax: 40,
                  },
                },
              }}
            />
          </div>
        )}
      </Card>
    );
  } else {
    var qualiteair="";

    switch(tout.current.air_quality['us-epa-index']) {
      case 1: qualiteair="bonne";break;
      case 2: qualiteair="modérée";break;
      case 3: qualiteair="mauvaise pour les personnes sensibles";break;
      case 4: qualiteair="mauvaise";break;
      case 5: qualiteair="très mauvaise";break;
      case 6: qualiteair="dangeureuse";break;
    }

    const [showDetails, setShowDetails] = useState(false);

    const handleToggleDetails = () => {
      setShowDetails(!showDetails);
    };
  
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" color="black" component="h2" gutterBottom>
            {date},
          </Typography>
          <img src={iconCode} alt={condition} />
          <Typography variant="body1" color="black" component="p">
            {condition}
          </Typography>
          <Typography variant="h6" color="black">
            Température : {temp}°C
          </Typography>
          <Typography variant="body2" color="black" component="p">
            Ressenti : {tout.current.feelslike_c} °C
            <br />
          </Typography>
          <Typography variant="h6" color="black">
            UV : {tout.current.uv}
            <br />
            Humidité : {tout.current.humidity} %
            <br />
            Qualité de l'air : {qualiteair}
            <br></br>
            {showDetails ? (
              <ExpandLessIcon onClick={handleToggleDetails} />
            ) : (
              <ExpandMoreIcon onClick={handleToggleDetails} />
            )}
          </Typography>
          {showDetails && (
            <div>
              <Typography variant="body2" color="black" component="p">
                Monoxyde de carbone : {(tout.current.air_quality.co).toFixed(3)} μg/m3
                <br></br>
                Ozone : {(tout.current.air_quality.o3.toFixed(3))} μg/m3
                <br></br>
                Dioxyde d'azote : {(tout.current.air_quality.no2.toFixed(3))} μg/m3
                <br></br>
                Dioxyde de soufre : {(tout.current.air_quality.so2).toFixed(3)} μg/m3
                <br></br>
                Particules fines : {(tout.current.air_quality.pm2_5).toFixed(3)} μg/m3
                <br></br>
                Particules  : {(tout.current.air_quality.pm10).toFixed(3)} μg/m3
              </Typography>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
};

export default WeatherCard;
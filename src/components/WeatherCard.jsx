import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import 'chartjs-adapter-moment/dist/chartjs-adapter-moment';

import { LineController, CategoryScale } from 'chart.js';
Chart.register(LineController, CategoryScale);

const useStyles = makeStyles({
  card: {
    maxWidth: 300,
    margin: 'auto',
    marginTop: 20,
    padding: 20,
    textAlign: 'center',
    backgroundImage: 'linear-gradient(to bottom, #ffffff, #fafafa, #f5f5f5, #f0f0f0, #ebebeb)',
  },
  chartContainer: {
    marginTop: 20,
  },
});

const WeatherCard = ({ date, temp, condition, iconCode, chartData, index }) => {
    const classes = useStyles();
    const getChartData = () => {
        if (chartData) {
          const temperatures = chartData.forecast.forecastday[index].hour.map((hour) => hour.temp_c);
          const labels = chartData.forecast.forecastday[index].hour.map((hour) => hour.time);
      
          return {
            labels,
            datasets: [
              {
                label: 'Temperature',
                data: temperatures,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
            ],
          };
        }
        return null;
    };

    return (
        <Card className={classes.card}>
        <CardContent>
            <Typography variant="h5" color="black" component="h2" gutterBottom>
            {date}
            </Typography>
            <img src={iconCode} alt={condition} />
            <Typography variant="h6" color="black">
            {temp}°C
            </Typography>
            <Typography variant="body1" color="black" component="p">
            {condition}
            </Typography>
        </CardContent>

        {chartData && (
            <div className={classes.chartContainer}>
            <Line
                data={getChartData()}
                options={{
                    scales: {
                    x: {
                        display:false,
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
};

export default WeatherCard;
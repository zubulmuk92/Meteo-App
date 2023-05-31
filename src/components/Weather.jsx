import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCard from './WeatherCard';

const Weather = ({ defaultVille }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState(defaultVille || '');
    const apiKey = "3203acfa93c14eb0bb895032233005";

    const body = document.querySelector('body');
    const content = document.getElementById('content');
    if (content) {
        if (content.clientHeight > window.innerHeight) {
            body.style.height = 'max-content';
        }
    }

    useEffect(() => {
        if (defaultVille && city !== defaultVille) {
            setCity(defaultVille);
        }
    }, [defaultVille]);

    const fetchWeatherData = async () => {
        try {
            const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=yes&lang=fr`);
            setWeatherData(response.data);
        } catch (error) {
            console.error(error);
            alert("La ville n'a pas été trouvé ...");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchWeatherData();
    };

    if (!weatherData) {
        return (
        <div className="content">
            <form onSubmit={handleSubmit}>
            <div className="input-field">
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Entrer le nom d'une ville"
            />
            </div>
            <button type="submit">Récupérer la météo</button>
            </form>
        </div>
        );
    }

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="input-field">
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Entrer le nom d'une ville"
                        />
                    </div>
                    <button type="submit">Récupérer la météo</button>
                </form>
            </div>
        <WeatherCard 
            date={"Aujourd'hui"}
            temp={weatherData.current.temp_c}
            condition={weatherData.current.condition.text}
            iconCode={weatherData.current.condition.icon}
            index={-1}
            tout={weatherData}
        />

        <div className="container">
            {weatherData.forecast.forecastday.map((forecastDay,index) => (
            <div className="child" key={forecastDay.date}>
                <WeatherCard
                    date={forecastDay.date}
                    temp={forecastDay.day.avgtemp_c}
                    condition={forecastDay.day.condition.text}
                    iconCode={forecastDay.day.condition.icon}
                    chartData={weatherData}
                    index={index}
                />
            </div>
            ))}
        </div>

        {/* <h2>Météo à {weatherData.location.name}, {weatherData.location.country}</h2>
        <h3>Météo actuelle</h3>
        <p>Temperature: {weatherData.current.temp_c}°C</p>
        <p>Description: {weatherData.current.condition.text}</p>
        <h3>Prévisions des 3 prochains jours</h3>
        <div>
            {weatherData.forecast.forecastday.map((forecastDay) => (
            <div key={forecastDay.date}>
                <h4>{forecastDay.date}</h4>
                <p>Average Temperature: {forecastDay.day.avgtemp_c}°C</p>
                <p>Description: {forecastDay.day.condition.text}</p>
            </div>
            ))}
        </div> */}
        </div>
    );
};

export default Weather;
// frontend/src/components/dashboard/WeatherWidget.jsx
import React, { useState, useEffect } from 'react';

const WeatherWidget = () => {
    const [weather, setWeather] = useState({
        location: 'Loading...',
        temperature: '--',
        condition: 'Loading...',
        icon: 'fa-cloud',
        date: '',
        high: '--',
        low: '--',
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Set to loading state
                setWeather(prev => ({ ...prev, loading: true }));

                // API key and default location (this would ideally come from user settings)
                const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
                const latitude = 5.6037; // Default to Accra, Ghana
                const longitude = -0.1870;

                // Fetch weather data from Pirate Weather API
                const response = await fetch(
                    `https://api.pirateweather.net/forecast/${apiKey}/${latitude},${longitude}?units=si&exclude=minutely,alerts`
                );

                if (!response.ok) {
                    throw new Error(`Weather API Error: ${response.status}`);
                }

                const data = await response.json();

                // Get location name (in a real app, you might use reverse geocoding or let users name locations)
                // For now, using timezone as a fallback location name
                const locationName = data.timezone.split('/').pop().replace('_', ' ');

                // Map icon from API to Font Awesome
                const iconMap = {
                    'clear-day': 'fa-sun',
                    'clear-night': 'fa-moon',
                    'rain': 'fa-cloud-rain',
                    'snow': 'fa-snowflake',
                    'sleet': 'fa-cloud-meatball',
                    'wind': 'fa-wind',
                    'fog': 'fa-smog',
                    'cloudy': 'fa-cloud',
                    'partly-cloudy-day': 'fa-cloud-sun',
                    'partly-cloudy-night': 'fa-cloud-moon',
                    'thunderstorm': 'fa-bolt',
                    'hail': 'fa-cloud-meatball'
                };

                // Format date
                const today = new Date();
                const formattedDate = today.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });

                // Update weather state with API data
                setWeather({
                    location: locationName,
                    temperature: Math.round(data.currently.temperature),
                    condition: data.currently.summary,
                    icon: iconMap[data.currently.icon] || 'fa-cloud',
                    date: formattedDate,
                    high: Math.round(data.daily.data[0].temperatureHigh),
                    low: Math.round(data.daily.data[0].temperatureLow),
                    humidity: Math.round(data.currently.humidity * 100),
                    windSpeed: Math.round(data.currently.windSpeed),
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error('Error fetching weather data:', error);
                setWeather(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Failed to load weather data'
                }));
            }
        };

        fetchWeather();

        // Refresh weather data every 30 minutes
        const refreshInterval = setInterval(fetchWeather, 30 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, []);

    // Loading state
    if (weather.loading) {
        return (
            <div className="glass-card weather-widget widget-loading">
                <div className="loading-pulse"></div>
            </div>
        );
    }

    // Error state
    if (weather.error) {
        return (
            <div className="glass-card weather-widget widget-error">
                <i className="fas fa-exclamation-circle"></i>
                <p>{weather.error}</p>
            </div>
        );
    }

    return (
        <div className="glass-card weather-widget">
            <div className="weather-content">
                <div className="weather-location">
                    <h3>{weather.location}</h3>
                    <p className="weather-date">{weather.date}</p>
                </div>

                <div className="weather-display">
                    <div className="weather-icon">
                        <i className={`fas ${weather.icon}`}></i>
                        <p className="weather-condition">{weather.condition}</p>
                    </div>

                    <div className="weather-temp">
                        <h2>{weather.temperature}°C</h2>
                        <div className="weather-high-low">
                            <span className="weather-high">H: {weather.high}°</span>
                            <span className="weather-low">L: {weather.low}°</span>
                        </div>
                    </div>
                </div>

                <div className="weather-details">
                    <div className="weather-detail">
                        <i className="fas fa-tint"></i>
                        <span>{weather.humidity}%</span>
                    </div>
                    <div className="weather-detail">
                        <i className="fas fa-wind"></i>
                        <span>{weather.windSpeed} m/s</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;

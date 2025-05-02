// frontend/src/components/dashboard/InsightsPage.jsx
import React, { useState, useEffect } from 'react';
import sensorService from '../../services/sensorService';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import DeviceAddModal from './DeviceAddModal';
import '../../styles/insights.css';

const InsightsPage = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('24h'); // '24h', '7days', 'historical'
    const [sensorData, setSensorData] = useState({
        temperatureHumidity: [],
        latestReading: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch aggregated data based on time range
                const aggregatedData = await sensorService.getAggregatedSensorData(timeRange);
                
                // Get latest reading
                const latestReading = await sensorService.getLatestSensorData();

                setSensorData({
                    temperatureHumidity: aggregatedData,
                    latestReading: latestReading.data
                });

            } catch (error) {
                console.error('Error fetching sensor data:', error);
                setError('Failed to load sensor data');
            } finally {
                setLoading(false);
            }
        };

        fetchSensorData();
    }, [timeRange]);

    // Time range selector component
    const TimeRangeSelector = () => (
        <div className="insights-time-selector">
            <div className="time-range-selector">
                <button 
                    className={`time-btn ${timeRange === '24h' ? 'active' : ''}`}
                    onClick={() => setTimeRange('24h')}
                >
                    24 Hours
                </button>
                <button 
                    className={`time-btn ${timeRange === '7days' ? 'active' : ''}`}
                    onClick={() => setTimeRange('7days')}
                >
                    7 Days
                </button>
                <button 
                    className={`time-btn ${timeRange === 'historical' ? 'active' : ''}`}
                    onClick={() => setTimeRange('historical')}
                >
                    Historical
                </button>
            </div>
        </div>
    );

    // Enhanced Chart component with better styling and scaling
    const TemperatureHumidityChart = () => {
        // Calculate min and max values for better scaling
        const tempMin = Math.min(...sensorData.temperatureHumidity.map(d => d.temperature));
        const tempMax = Math.max(...sensorData.temperatureHumidity.map(d => d.temperature));
        const humidityMin = Math.min(...sensorData.temperatureHumidity.map(d => d.humidity));
        const humidityMax = Math.max(...sensorData.temperatureHumidity.map(d => d.humidity));

        // Custom tooltip styles
        const CustomTooltip = ({ active, payload, label }) => {
            if (active && payload && payload.length) {
                return (
                    <div className="custom-tooltip">
                        <p className="tooltip-time">{new Date(label).toLocaleString()}</p>
                        {payload.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }}>
                                {entry.name}: {entry.value.toFixed(1)} {entry.name === 'Temperature' ? '°C' : '%'}
                            </p>
                        ))}
                    </div>
                );
            }
            return null;
        };

        return (
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={sensorData.temperatureHumidity}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(timestamp) => {
                            const date = new Date(timestamp);
                            return timeRange === '24h'
                                ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                        }}
                        stroke="#666"
                    />
                    <YAxis
                        yAxisId="temp"
                        domain={[Math.floor(tempMin - 2), Math.ceil(tempMax + 2)]}
                        label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                        stroke="#8884d8"
                    />
                    <YAxis
                        yAxisId="humidity"
                        orientation="right"
                        domain={[Math.floor(humidityMin - 5), Math.ceil(humidityMax + 5)]}
                        label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight' }}
                        stroke="#82ca9d"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                        yAxisId="temp"
                        type="monotone"
                        dataKey="temperature"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                        name="Temperature"
                    />
                    <Line
                        yAxisId="humidity"
                        type="monotone"
                        dataKey="humidity"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                        name="Humidity"
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="insights-container p-4">
            <div className="insights-header mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Environmental Insights</h2>
                <TimeRangeSelector />
            </div>

            {sensorData.latestReading && (
                <div className="current-readings grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="reading-card bg-white p-6 rounded-lg shadow-md">
                        <i className="fas fa-temperature-high text-3xl text-red-500 mb-2"></i>
                        <h3 className="text-lg font-semibold text-gray-700">Current Temperature</h3>
                        <p className="text-3xl font-bold text-gray-900">{sensorData.latestReading.temperature}°C</p>
                    </div>
                    <div className="reading-card bg-white p-6 rounded-lg shadow-md">
                        <i className="fas fa-tint text-3xl text-blue-500 mb-2"></i>
                        <h3 className="text-lg font-semibold text-gray-700">Current Humidity</h3>
                        <p className="text-3xl font-bold text-gray-900">{sensorData.latestReading.humidity}%</p>
                    </div>
                </div>
            )}

            <div className="chart-container bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Temperature & Humidity Trends</h3>
                <TemperatureHumidityChart />
            </div>
        </div>
    );
};

export default InsightsPage;

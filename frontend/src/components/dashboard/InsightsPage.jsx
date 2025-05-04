import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import sensorService from '../../services/sensorService';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../../assets/css/insights.css';

const InsightsPage = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('24h');
    const [selectedMetric, setSelectedMetric] = useState('all'); // 'all', 'temperature', 'humidity', 'power'
    const [sensorData, setSensorData] = useState({
        temperatureHumidity: [],
        latestReading: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Metric selector component
    const MetricSelector = () => (
        <div className="metric-selector mb-4">
            <select 
                className="metric-select"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
            >
                <option value="all">All Metrics</option>
                <option value="temperature">Temperature</option>
                <option value="humidity">Humidity</option>
                <option value="power">Power Consumption</option>
            </select>
        </div>
    );

    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Generate sample data if API fails
                const sampleData = Array.from({ length: 24 }, (_, i) => {
                    const date = new Date();
                    date.setHours(date.getHours() - 23 + i);
                    return {
                        timestamp: date.getTime(),
                        temperature: 20 + Math.random() * 5,
                        humidity: 40 + Math.random() * 20,
                        power_consumption: 100 + Math.random() * 50
                    };
                });

                try {
                    const aggregatedData = await sensorService.getAggregatedSensorData(timeRange);
                    const latestReading = await sensorService.getLatestSensorData();
                    
                    setSensorData({
                        temperatureHumidity: aggregatedData.length > 0 ? aggregatedData : sampleData,
                        latestReading: latestReading
                    });
                } catch (error) {
                    console.warn('API fetch failed, using sample data');
                    setSensorData({
                        temperatureHumidity: sampleData,
                        latestReading: sampleData[sampleData.length - 1]
                    });
                }
            } catch (error) {
                console.error('Error in data handling:', error);
                setError('Failed to load sensor data');
            } finally {
                setLoading(false);
            }
        };

        fetchSensorData();
    }, [timeRange]);

    return (
        <div className="insights-container p-4">
            <div className="insights-header mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Environmental Insights</h2>
                <div className="controls-container">
                    <TimeRangeSelector />
                    <MetricSelector />
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="error-state">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>{error}</p>
                </div>
            ) : (
                <>
                    <div className="insights-chart-container">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Environmental Trends</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart
                                data={sensorData.temperatureHumidity}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                                <XAxis
                                    dataKey="timestamp"
                                    tickFormatter={(timestamp) => {
                                        const date = new Date(timestamp);
                                        return timeRange === '24h'
                                            ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                                    }}
                                    stroke="#666"
                                    fontSize={12}
                                />
                                {(selectedMetric === 'all' || selectedMetric === 'temperature') && (
                                    <YAxis
                                        yAxisId="temp"
                                        domain={['auto', 'auto']}
                                        label={{ value: '°C', angle: -90, position: 'insideLeft', offset: 8 }}
                                        stroke="#FF0000"
                                        fontSize={12}
                                    />
                                )}
                                {(selectedMetric === 'all' || selectedMetric === 'humidity') && (
                                    <YAxis
                                        yAxisId="humidity"
                                        orientation="right"
                                        domain={[0, 100]}
                                        label={{ value: '%', angle: 90, position: 'insideRight', offset: 8 }}
                                        stroke="#4ECDC4"
                                        fontSize={12}
                                    />
                                )}
                                {(selectedMetric === 'all' || selectedMetric === 'power') && (
                                    <YAxis
                                        yAxisId="power"
                                        orientation="right"
                                        domain={[0, 'auto']}
                                        label={{ value: 'W', angle: 90, position: 'insideRight', offset: 45 }}
                                        stroke="#FFD93D"
                                        fontSize={12}
                                    />
                                )}
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value, name) => {
                                        if (name === "Power") {
                                            return [`${value.toFixed(2)} W`, name];
                                        }
                                        return [value, name];
                                    }}
                                />
                                <Legend 
                                    verticalAlign="top" 
                                    height={36}
                                    wrapperStyle={{
                                        paddingBottom: '20px'
                                    }}
                                />
                                {(selectedMetric === 'all' || selectedMetric === 'temperature') && (
                                    <Line
                                        yAxisId="temp"
                                        type="monotone"
                                        dataKey="temperature"
                                        stroke="#FF0000"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4 }}
                                        name="Temperature"
                                    />
                                )}
                                {(selectedMetric === 'all' || selectedMetric === 'humidity') && (
                                    <Line
                                        yAxisId="humidity"
                                        type="monotone"
                                        dataKey="humidity"
                                        stroke="#4ECDC4"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4 }}
                                        name="Humidity"
                                    />
                                )}
                                {(selectedMetric === 'all' || selectedMetric === 'power') && (
                                    <Line
                                        yAxisId="power"
                                        type="monotone"
                                        dataKey="power_consumption"
                                        stroke="#FFD93D"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4 }}
                                        name="Power"
                                    />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}

            {/* Navigation Section */}
            <nav className="fixed-bottom-nav">
                <Link to="/dashboard" className="nav-link">
                    <i className="fas fa-home"></i>
                    <span>Home</span>
                </Link>
                <Link to="/insights" className="nav-link active">
                    <i className="fas fa-chart-line"></i>
                    <span>Insights</span>
                </Link>
                <Link to="/" className="nav-link add-button">
                    <div className="plus-circle">
                        <i className="fas fa-plus"></i>
                    </div>
                </Link>
                <Link to="/automation" className="nav-link">
                    <i className="fas fa-sliders-h"></i>
                    <span>Automation</span>
                </Link>
                <Link to="/profile" className="nav-link">
                    <i className="fas fa-user"></i>
                    <span>Profile</span>
                </Link>
            </nav>
        </div>
    );
};

export default InsightsPage;

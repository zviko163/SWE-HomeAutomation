// frontend/src/components/dashboard/InsightsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import DeviceAddModal from './DeviceAddModal';

const InsightsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [insightsData, setInsightsData] = useState({
        temperatureHumidity: [],
        energyUsage: [],
        weeklyComparison: [],
        deviceUsage: []
    });

    // Time period selection
    const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month'

    useEffect(() => {
        const fetchInsightsData = async () => {
            try {
                setLoading(true);

                // Simulate API loading time
                await new Promise(resolve => setTimeout(resolve, 1200));

                // Generate sample data based on time range
                const data = generateSampleData(timeRange);
                setInsightsData(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching insights data:', err);
                setError('Failed to load insights data. Please try again later.');
                setLoading(false);
            }
        };

        fetchInsightsData();
    }, [timeRange]);

    // Generate sample data based on selected time range
    const generateSampleData = (range) => {
        let tempHumidityData = [];
        let energyUsageData = [];
        let weeklyComparisonData = [];
        let deviceUsageData = [];

        const now = new Date();
        let dataPoints;
        let format;

        // Set number of data points and format based on range
        switch (range) {
            case 'day':
                dataPoints = 24;
                format = 'hour';
                break;
            case 'week':
                dataPoints = 7;
                format = 'day';
                break;
            case 'month':
                dataPoints = 30;
                format = 'day';
                break;
            default:
                dataPoints = 7;
                format = 'day';
        }

        // Generate temperature/humidity data
        for (let i = 0; i < dataPoints; i++) {
            const date = new Date(now);
            if (format === 'hour') {
                date.setHours(now.getHours() - (dataPoints - 1) + i);
            } else {
                date.setDate(now.getDate() - (dataPoints - 1) + i);
            }

            // Create random but realistic temperature and humidity values
            // Temperature fluctuates through the day/week
            const baseTemp = 22; // Base temperature in Celsius
            const hourOfDay = date.getHours();
            let tempVariation;

            if (hourOfDay >= 0 && hourOfDay < 6) {
                // Coolest in early morning
                tempVariation = -2 + Math.random() * 1;
            } else if (hourOfDay >= 6 && hourOfDay < 12) {
                // Warming up in morning
                tempVariation = -1 + Math.random() * 2;
            } else if (hourOfDay >= 12 && hourOfDay < 18) {
                // Warmest in afternoon
                tempVariation = 1 + Math.random() * 2;
            } else {
                // Cooling in evening
                tempVariation = 0 + Math.random() * 1;
            }

            // Add some variation based on day of week (warmer on weekends for example)
            if (format !== 'hour') {
                const dayOfWeek = date.getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    tempVariation += 0.5; // Slightly warmer on weekends
                }
            }

            const temperature = Math.round((baseTemp + tempVariation) * 10) / 10;

            // Humidity inversely related to temperature but with some randomness
            const baseHumidity = 50;
            const humidityVariation = (baseTemp - temperature) * 2 + (Math.random() * 10 - 5);
            const humidity = Math.min(Math.max(Math.round(baseHumidity + humidityVariation), 30), 80);

            tempHumidityData.push({
                timestamp: date.toISOString(),
                label: format === 'hour'
                    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
                temperature,
                humidity
            });
        }

        // Generate energy usage data
        for (let i = 0; i < dataPoints; i++) {
            const date = new Date(now);
            if (format === 'hour') {
                date.setHours(now.getHours() - (dataPoints - 1) + i);
            } else {
                date.setDate(now.getDate() - (dataPoints - 1) + i);
            }

            // Energy usage patterns
            const hourOfDay = date.getHours();
            let baseUsage;

            if (format === 'hour') {
                if (hourOfDay >= 7 && hourOfDay < 10) {
                    // Morning peak
                    baseUsage = 2.5 + Math.random() * 1;
                } else if (hourOfDay >= 10 && hourOfDay < 17) {
                    // Day usage
                    baseUsage = 1.5 + Math.random() * 1;
                } else if (hourOfDay >= 17 && hourOfDay < 22) {
                    // Evening peak
                    baseUsage = 3 + Math.random() * 1.5;
                } else {
                    // Night usage
                    baseUsage = 0.5 + Math.random() * 0.5;
                }
            } else {
                // Daily patterns - weekends higher
                const dayOfWeek = date.getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    // Weekends
                    baseUsage = 12 + Math.random() * 6;
                } else {
                    // Weekdays
                    baseUsage = 8 + Math.random() * 6;
                }
            }

            energyUsageData.push({
                timestamp: date.toISOString(),
                label: format === 'hour'
                    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
                usage: Math.round(baseUsage * 10) / 10
            });
        }

        // Generate weekly comparison data (last 7 days vs previous 7 days)
        const categories = ['Temperature', 'Humidity', 'Energy', 'Lights On', 'Security'];
        categories.forEach(category => {
            const currentValue = 70 + Math.random() * 30;
            const previousValue = currentValue * (0.85 + Math.random() * 0.3); // 15% variation up or down

            weeklyComparisonData.push({
                category,
                current: Math.round(currentValue),
                previous: Math.round(previousValue),
                change: Math.round((currentValue - previousValue) / previousValue * 100)
            });
        });

        // Generate device usage data
        const devices = ['Living Room Lights', 'Kitchen Appliances', 'Bedroom Lights', 'TV', 'Thermostat'];
        devices.forEach(device => {
            deviceUsageData.push({
                name: device,
                usage: Math.round(10 + Math.random() * 90)
            });
        });

        return {
            temperatureHumidity: tempHumidityData,
            energyUsage: energyUsageData,
            weeklyComparison: weeklyComparisonData,
            deviceUsage: deviceUsageData
        };
    };

    // Render time range selector buttons
    const renderTimeRangeSelector = () => {
        return (
            <div className="time-range-selector">
                <button
                    className={`time-btn ${timeRange === 'day' ? 'active' : ''}`}
                    onClick={() => setTimeRange('day')}
                >
                    24h
                </button>
                <button
                    className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
                    onClick={() => setTimeRange('week')}
                >
                    7 Days
                </button>
                <button
                    className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
                    onClick={() => setTimeRange('month')}
                >
                    30 Days
                </button>
            </div>
        );
    };

    // Custom tooltip for temperature/humidity chart
    const TempHumidityTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{label}</p>
                    <p className="tooltip-temp">
                        <span className="tooltip-icon"><i className="fas fa-temperature-high"></i></span>
                        {payload[0].value}°C
                    </p>
                    <p className="tooltip-humidity">
                        <span className="tooltip-icon"><i className="fas fa-tint"></i></span>
                        {payload[1].value}%
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom tooltip for energy chart
    const EnergyTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{label}</p>
                    <p className="tooltip-energy">
                        <span className="tooltip-icon"><i className="fas fa-bolt"></i></span>
                        {payload[0].value} kWh
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom tooltip for device usage chart
    const DeviceTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{label}</p>
                    <p className="tooltip-usage">
                        <span className="tooltip-icon"><i className="fas fa-clock"></i></span>
                        {payload[0].value}% usage
                    </p>
                </div>
            );
        }
        return null;
    };

    // edits to make the add modal work
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [devices, setDevices] = useState([]);
    const handleAddDevice = (newDevice) => {
        // In a real app, you would send this to your backend
        // For now, we'll just add it to our local state
        setDevices(prevDevices => [...prevDevices, newDevice]);
    };

    // Loading state
    if (loading) {
        return (
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <div className="user-greeting">
                        <h1>Insights</h1>
                        <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    </div>
                </header>

                <main className="dashboard-content">
                    <div className="insights-loading">
                        <div className="loading-pulse"></div>
                        <p>Loading insights data...</p>
                    </div>
                </main>

                {/* Bottom Navigation */}
                <nav className="bottom-nav">
                    <button className="nav-item" onClick={() => navigate('/dashboard')}>
                        <i className="fas fa-home"></i>
                        <span>Home</span>
                    </button>
                    <button className="nav-item active">
                        <i className="fas fa-chart-bar"></i>
                        <span>Insights</span>
                    </button>
                    <button
                        className="nav-item add-button"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                    <button className="nav-item">
                        <i className="fas fa-bolt"></i>
                        <span>Automation</span>
                    </button>
                    <button className="nav-item">
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                    </button>
                </nav>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <div className="user-greeting">
                        <h1>Insights</h1>
                        <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    </div>
                </header>

                <main className="dashboard-content">
                    <div className="insights-error">
                        <i className="fas fa-exclamation-circle"></i>
                        <h3>Unable to load insights</h3>
                        <p>{error}</p>
                        <button
                            className="btn btn-primary mt-3"
                            onClick={() => setLoading(true)}
                        >
                            Try Again
                        </button>
                    </div>
                </main>

                {/* Bottom Navigation */}
                <nav className="bottom-nav">
                    <button className="nav-item" onClick={() => navigate('/dashboard')}>
                        <i className="fas fa-home"></i>
                        <span>Home</span>
                    </button>
                    <button className="nav-item active">
                        <i className="fas fa-chart-bar"></i>
                        <span>Insights</span>
                    </button>
                    <button
                        className="nav-item add-button"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                    <button className="nav-item">
                        <i className="fas fa-bolt"></i>
                        <span>Automation</span>
                    </button>
                    <button className="nav-item">
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                    </button>
                </nav>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="user-greeting">
                    <h1>Insights</h1>
                    <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="header-actions">
                    <button className="icon-button notification-btn">
                        <i className="fas fa-bell"></i>
                    </button>
                    <button className="icon-button settings-btn">
                        <i className="fas fa-cog"></i>
                    </button>
                </div>
            </header>

            <main className="dashboard-content insights-content">
                {/* Time Range Selector */}
                <div className="insights-time-selector">
                    {renderTimeRangeSelector()}
                </div>

                {/* Temperature and Humidity Chart */}
                <section className="insights-section glass-card">
                    <div className="insights-section-header">
                        <h2>Temperature & Humidity</h2>
                    </div>
                    <div className="insights-chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart
                                data={insightsData.temperatureHumidity}
                                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 10, fill: 'var(--gray-600)' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    yAxisId="temp"
                                    tick={{ fontSize: 10, fill: 'var(--gray-600)' }}
                                    tickLine={false}
                                    axisLine={false}
                                    orientation="left"
                                    domain={['dataMin - 2', 'dataMax + 2']}
                                    label={{
                                        value: '°C',
                                        position: 'insideLeft',
                                        angle: -90,
                                        fill: 'var(--gray-600)',
                                        fontSize: 10,
                                        dx: -15
                                    }}
                                />
                                <YAxis
                                    yAxisId="humidity"
                                    tick={{ fontSize: 10, fill: 'var(--gray-600)' }}
                                    tickLine={false}
                                    axisLine={false}
                                    orientation="right"
                                    domain={[0, 100]}
                                    label={{
                                        value: '%',
                                        position: 'insideRight',
                                        angle: -90,
                                        fill: 'var(--gray-600)',
                                        fontSize: 10,
                                        dx: 15
                                    }}
                                />
                                <Tooltip content={<TempHumidityTooltip />} />
                                <Legend
                                    verticalAlign="top"
                                    height={36}
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '12px' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="temperature"
                                    stroke="var(--danger)"
                                    strokeWidth={2}
                                    dot={{ r: 3, strokeWidth: 1 }}
                                    activeDot={{ r: 5, strokeWidth: 0 }}
                                    yAxisId="temp"
                                    name="Temperature"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="humidity"
                                    stroke="var(--blue-accent)"
                                    strokeWidth={2}
                                    dot={{ r: 3, strokeWidth: 1 }}
                                    activeDot={{ r: 5, strokeWidth: 0 }}
                                    yAxisId="humidity"
                                    name="Humidity"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Energy Usage Chart */}
                <section className="insights-section glass-card">
                    <div className="insights-section-header">
                        <h2>Energy Usage</h2>
                    </div>
                    <div className="insights-chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart
                                data={insightsData.energyUsage}
                                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 10, fill: 'var(--gray-600)' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: 'var(--gray-600)' }}
                                    tickLine={false}
                                    axisLine={false}
                                    label={{
                                        value: 'kWh',
                                        position: 'insideLeft',
                                        angle: -90,
                                        fill: 'var(--gray-600)',
                                        fontSize: 10,
                                        dx: -15
                                    }}
                                />
                                <Tooltip content={<EnergyTooltip />} />
                                <Legend
                                    verticalAlign="top"
                                    height={36}
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '12px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="usage"
                                    name="Energy Usage"
                                    stroke="var(--primary)"
                                    strokeWidth={2}
                                    fill="url(#energyGradient)"
                                    activeDot={{ r: 5, strokeWidth: 0 }}
                                />
                                <defs>
                                    <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Weekly Comparisons */}
                <section className="insights-section glass-card">
                    <div className="insights-section-header">
                        <h2>Weekly Comparison</h2>
                    </div>
                    <div className="weekly-comparison-container">
                        <div className="comparison-period">
                            <div className="comparison-dates">
                                <div className="current-period">Current Week</div>
                                <div className="vs">vs</div>
                                <div className="previous-period">Previous Week</div>
                            </div>
                        </div>
                        <div className="comparison-metrics">
                            {insightsData.weeklyComparison.map((item, index) => (
                                <div key={index} className="comparison-item">
                                    <div className="comparison-category">{item.category}</div>
                                    <div className="comparison-values">
                                        <div className="current-value">{item.current}</div>
                                        <div className="vs-arrow">
                                            <i className={`fas fa-arrow-${item.change >= 0 ? 'up' : 'down'}`}></i>
                                        </div>
                                        <div className="previous-value">{item.previous}</div>
                                    </div>
                                    <div className={`comparison-change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                                        {item.change >= 0 ? '+' : ''}{item.change}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Device Usage Chart */}
                <section className="insights-section glass-card">
                    <div className="insights-section-header">
                        <h2>Device Usage</h2>
                    </div>
                    <div className="insights-chart-container">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart
                                data={insightsData.deviceUsage}
                                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                                layout="vertical"
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    type="number"
                                    tick={{ fontSize: 10, fill: 'var(--gray-600)' }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={[0, 100]}
                                    unit="%"
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={{ fontSize: 10, fill: 'var(--gray-600)' }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={120}
                                />
                                <Tooltip content={<DeviceTooltip />} />
                                <Bar
                                    dataKey="usage"
                                    fill="var(--dark-green)"
                                    background={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                                    radius={[0, 4, 4, 0]}
                                    name="Usage"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </main>

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <button className="nav-item" onClick={() => navigate('/dashboard')}>
                    <i className="fas fa-home"></i>
                    <span>Home</span>
                </button>
                <button className="nav-item active">
                    <i className="fas fa-chart-bar"></i>
                    <span>Insights</span>
                </button>
                <button
                    className="nav-item add-button"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <i className="fas fa-plus"></i>
                </button>
                <button className="nav-item">
                    <i className="fas fa-bolt"></i>
                    <span>Automation</span>
                </button>
                <button className="nav-item">
                    <i className="fas fa-user"></i>
                    <span>Profile</span>
                </button>
            </nav>
            <DeviceAddModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddDevice={handleAddDevice}
            />
        </div>
    );
};

export default InsightsPage;

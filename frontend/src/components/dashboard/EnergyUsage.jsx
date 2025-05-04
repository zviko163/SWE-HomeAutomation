// frontend/src/components/dashboard/EnergyUsage.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import dashImg from '../../assets/images/dash-image.jpg';

const EnergyUsage = () => {
    const [energyData, setEnergyData] = useState({
        currentUsage: 0,
        todayTotal: 0,
        weekComparison: 0,
        chartData: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        // In a real app, this would fetch from your backend API
        // For now, we'll simulate with sample data
        const fetchEnergyData = async () => {
            try {
                // Simulate API loading time
                await new Promise(resolve => setTimeout(resolve, 800));

                // Generate sample hourly data for the past 24 hours
                const now = new Date();
                const hourlyData = Array.from({ length: 24 }, (_, i) => {
                    const hour = new Date(now);
                    hour.setHours(now.getHours() - 23 + i);

                    // Create random usage pattern that's higher during day, lower at night
                    const hourOfDay = hour.getHours();
                    let baseUsage;

                    if (hourOfDay >= 7 && hourOfDay < 10) {
                        // Morning peak
                        baseUsage = 30 + Math.random() * 20;
                    } else if (hourOfDay >= 10 && hourOfDay < 17) {
                        // Day usage
                        baseUsage = 25 + Math.random() * 15;
                    } else if (hourOfDay >= 17 && hourOfDay < 22) {
                        // Evening peak
                        baseUsage = 35 + Math.random() * 25;
                    } else {
                        // Night usage
                        baseUsage = 10 + Math.random() * 10;
                    }

                    return {
                        time: hour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        usage: Math.round(baseUsage * 10) / 10,
                        timestamp: hour.getTime()
                    };
                });

                // Calculate totals
                const todayTotal = hourlyData.reduce((sum, hour) => sum + hour.usage, 0);
                const currentUsage = hourlyData[hourlyData.length - 1].usage;

                // Fake weekly comparison (5-15% less than last week)
                const weekComparison = -(5 + Math.random() * 10);

                setEnergyData({
                    currentUsage,
                    todayTotal: Math.round(todayTotal),
                    weekComparison: Math.round(weekComparison),
                    chartData: hourlyData,
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error('Error fetching energy data:', error);
                setEnergyData(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Failed to load energy data'
                }));
            }
        };

        fetchEnergyData();

        // Refresh data every 5 minutes
        const refreshInterval = setInterval(fetchEnergyData, 5 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, []);

    // Custom tooltip for the chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="energy-chart-tooltip">
                    <p className="time">{payload[0].payload.time}</p>
                    <p className="usage">{`${payload[0].value} kWh`}</p>
                </div>
            );
        }
        return null;
    };

    // Loading state
    if (energyData.loading) {
        return (
            <div className="glass-card energy-widget widget-loading">
                <div className="loading-pulse"></div>
            </div>
        );
    }

    // Error state
    if (energyData.error) {
        return (
            <div className="glass-card energy-widget widget-error">
                <i className="fas fa-exclamation-circle"></i>
                <p>{energyData.error}</p>
            </div>
        );
    }

    return (
        <div className="glass-card energy-widget">
            

            <div className="energy-image-container" style={{
                width: "100%",
                height: "calc(100% - 40px)", /* Subtract header height */
                overflow: "hidden",
                borderRadius: "10px",
                marginTop: "10px"
            }}>
                <img
                    src={dashImg}
                    alt="Energy Dashboard"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px"
                    }}
                />
            </div>
        </div>
    );
};

export default EnergyUsage;

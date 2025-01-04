import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Navbar from "../Navbar";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DateGraph = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [chartData, setChartData] = useState(null);
    const chartRef = useRef(null);
    const location = useLocation();
    const deviceId = location.state?.deviceId;

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (selectedDate && deviceId) {
                const formattedDate = selectedDate.toISOString().split('T')[0];
                fetchData(deviceId, formattedDate);
            }
        }, 2000);

        return () => clearInterval(intervalId);
    }, [selectedDate, deviceId]);

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    const fetchData = async (id, date) => {
        try {
            const response = await axios.get(
              `https://management-microservice.proudgrass-626b941a.westeurope.azurecontainerapps.io/monitoringapi/device/get-all-by-date`,
              {
                params: { id, date },
              }
            );

            const values = response.data;

            const labels = Array.from({ length: 24 }, (_, index) => `${index}:00`);

            setChartData({
                labels,
                datasets: [
                    {
                        label: `Energy Consumption for Device ID: ${id} on ${date}`,
                        data: values,
                        backgroundColor: 'rgba(75,192,192,0.6)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderWidth: 1
                    }
                ]
            });
        } catch (error) {
            console.error("Error fetching data", error);
            setChartData(null);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div>
                <Navbar />
                <Box sx={{ padding: 4 }}>
                    <Typography variant="h4" gutterBottom sx={{ mb: 5 }}>
                        Energy Consumption by Hour
                    </Typography>
                    <DatePicker
                        label="Select Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <Box sx={{ marginTop: 4 }}>
                        {chartData ? (
                            <div ref={chartRef}>
                                <Bar
                                    data={chartData}
                                    options={{
                                        scales: {
                                            x: {
                                                title: {
                                                    display: true,
                                                    text: 'Hour of the Day'
                                                }
                                            },
                                            y: {
                                                title: {
                                                    display: true,
                                                    text: 'Energy Consumption (kWh)'
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <Typography variant="body1">Select a date to see the data</Typography>
                        )}
                    </Box>
                </Box>
            </div>
        </LocalizationProvider>
    );
};

export default DateGraph;

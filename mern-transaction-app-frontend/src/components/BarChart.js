import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables); 
const BarChart = ({ month }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchBarChartData = async () => {
            const response = await axios.get(`http://localhost:5000/api/transactions/bar-chart`, {
                params: { month }
            });
            setData(response.data);
        };
        fetchBarChartData();
    }, [month]);

    const chartData = {
        labels: data.map(item => item.range),
        datasets: [
            {
                label: 'Number of Items',
                data: data.map(item => item.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div className="card">
            <div className="card-body">
                <h2 className="card-title">Bar Chart for {month}</h2>
                <div className="chart-container">
                    <Bar data={chartData} />
                </div>
            </div>
        </div>
    );
};

export default BarChart;

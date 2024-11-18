import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

const PieChart = ({ month }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchPieChartData = async () => {
            const response = await axios.get(`http://localhost:5000/api/transactions/pie-chart`, {
                params: { month }
            });
            setData(response.data);
        };
        fetchPieChartData();
    }, [month]);

    const chartData = {
        labels: data.map(item => item.category),
        datasets: [
            {
                data: data.map(item => item.count),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
            },
        ],
    };

    return (
        <div className="card">
            <div className="card-body">
                <h2 className="card-title">Pie Chart for {month}</h2>
                <div className="chart-container">
                    <Pie data={chartData} />
                </div>
            </div>
        </div>
    );
};

export default PieChart;

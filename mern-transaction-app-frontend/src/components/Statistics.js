import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Statistics = ({ month }) => {
    const [stats, setStats] = useState({ totalSales: 0, totalSoldItems: 0, totalNotSoldItems: 0 });

    useEffect(() => {
        const fetchStatistics = async () => {
            const response = await axios.get(`http://localhost:5000/api/transactions/statistics`, {
                params: { month }
            });
            setStats(response.data);
        };
        fetchStatistics();
    }, [month]);

    return (
        <div className="card">
            <div className="card-body">
                <h2 className="card-title">Statistics for {month}</h2>
                <ul className="list-group">
                    <li className="list-group-item">Total Sales: <strong>₹{stats.totalSales}</strong></li>
                    <li className="list-group-item">Total Sold Items: <strong>{stats.totalSoldItems}</strong></li>
                    <li className="list-group-item">Total Not Sold Items: <strong>{stats.totalNotSoldItems}</strong></li>
                </ul>
            </div>
        </div>
    );
};

export default Statistics;

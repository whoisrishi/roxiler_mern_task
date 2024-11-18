import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionTable from './components/TransactionTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import Navbar from './components/Navbar';  

const App = () => {
    const [month, setMonth] = useState('March');

    return (
        <Router>
            <div className="container mt-5">
                <Navbar />
                
                <div className="form-group">
                    <label htmlFor="month-select">Select Month</label>
                    <select 
                        id="month-select" 
                        className="form-control" 
                        value={month} 
                        onChange={(e) => setMonth(e.target.value)}
                    >
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                <Routes>
                    <Route path="/" element={<TransactionTable month={month} setMonth={setMonth} />} /> 
                    <Route path="/transactions" element={<TransactionTable month={month} setMonth={setMonth} />} />
                    <Route path="/statistics" element={<Statistics month={month} />} />
                    <Route path="/charts" element={<Charts month={month} />} />
                </Routes>
            </div>
        </Router>
    );
};

const Charts = ({ month }) => (
    <div>
        <h2>Charts for {month}</h2>
        <div className="row mt-4">
            <div className="col-lg-6 col-md-12">
                <BarChart month={month} />
            </div>
            <div className="col-lg-6 col-md-12">
                <PieChart month={month} />
            </div>
        </div>
    </div>
);

export default App;

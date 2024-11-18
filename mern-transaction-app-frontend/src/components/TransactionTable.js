import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionTable = ({ month, setMonth }) => {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchTransactions();
    }, [page, search, month]);

    const fetchTransactions = async () => {
        const response = await axios.get(`http://localhost:5000/api/transactions`, {
            params: { page, perPage, search, month }
        });
        setTransactions(response.data.transactions);
        setTotal(response.data.total);
    };

    return (
        <div className="card">
            <div className="card-body">
                <h2 className="card-title">Transactions</h2>

                {/* Search & Month Selector */}
                <div className="mb-3">
                    <div className="d-flex justify-content-between">
                        <input
                            type="text"
                            className="form-control w-50"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            className="form-control w-30"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)} // This is where setMonth is used
                        >
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Date of Sale</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction._id}>
                                    <td>{transaction.title}</td>
                                    <td>{transaction.description}</td>
                                    <td>₹{transaction.price}</td>
                                    <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                                    <td>{transaction.category}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage(page + 1)}
                        disabled={page * perPage >= total}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionTable;

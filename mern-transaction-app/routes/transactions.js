const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction');
const router = express.Router();

router.post('/initialize', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.deleteMany(); 
        await Transaction.insertMany(transactions); 

        res.status(200).json({ message: 'Database initialized successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error initializing database', error });
    }
});

router.get('/', async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;

    const query = {};
    
    if (month) {
        const monthNumber = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1;
        query.$expr = {
            $eq: [{ $month: "$dateOfSale" }, monthNumber]
        };
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
        ];
    }

    try {
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));

        const total = await Transaction.countDocuments(query);

        res.status(200).json({ transactions, total });
    } catch (error) {
        console.error('Error retrieving transactions:', error);  // Log the error
        res.status(500).json({ message: 'Error retrieving transactions', error: error.message });
    }
});

router.get('/statistics', async (req, res) => {
    const { month } = req.query;

    const monthNumber = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1; // Convert month name to month number

    try {
        const totalSales = await Transaction.aggregate([
            { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } } },
            { $group: { _id: null, total: { $sum: '$price' } } },
        ]);

        const totalSoldItems = await Transaction.countDocuments({ $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } });
        const totalNotSoldItems = await Transaction.countDocuments({ $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }, price: { $eq: 0 } });

        res.status(200).json({
            totalSales: totalSales[0]?.total || 0,
            totalSoldItems,
            totalNotSoldItems,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving statistics', error });
    }
});

router.get('/bar-chart', async (req, res) => {
    const { month } = req.query;

    const monthNumber = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1; // Convert month name to month number

    const priceRanges = [
        { range: '0-100', count: 0 },
        { range: '101-200', count: 0 },
        { range: '201-300', count: 0 },
        { range: '301-400', count: 0 },
        { range: '401-500', count: 0 },
        { range: '501-600', count: 0 },
        { range: '601-700', count: 0 },
        { range: '701-800', count: 0 },
        { range: '801-900', count: 0 },
        { range: '901-above', count: 0 },
    ];

    try {
        const transactions = await Transaction.find({ $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } });

        transactions.forEach(transaction => {
            const price = transaction.price;
            if (price <= 100) priceRanges[0].count++;
            else if (price <= 200) priceRanges[1].count++;
            else if (price <= 300) priceRanges[2].count++;
            else if (price <= 400) priceRanges[3].count++;
            else if (price <= 500) priceRanges[4].count++;
            else if (price <= 600) priceRanges[5].count++;
            else if (price <= 700) priceRanges[6].count++;
            else if (price <= 800) priceRanges[7].count++;
            else if (price <= 900) priceRanges[8].count++;
            else priceRanges[9].count++;
        });

        res.status(200).json(priceRanges);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bar chart data', error });
    }
});

router.get('/pie-chart', async (req, res) => {
    const { month } = req.query;

    const monthNumber = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1; 

    try {
        const categories = await Transaction.aggregate([
            { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        const result = categories.map(cat => ({ category: cat._id, count: cat.count }));
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving pie chart data', error });
    }
});

module.exports = router;

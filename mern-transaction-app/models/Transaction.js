const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    dateOfSale: { type: Date, required: true },
    category: String,
});

module.exports = mongoose.model('Transaction', transactionSchema);

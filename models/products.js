const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema ({
    title: String,
    price: String,
    manufacturingDate: String,
    expiryDate: String,
    image: String,
    companyName: String,
    category: String,
    description: String,
    benefits: String,
    sideEffects: String
})

module.exports = mongoose.model('Product',ProductSchema);

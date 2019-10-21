/**
 * Created by Libing on 2019/10/18 19:04
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productSchema = new Schema({
    "productId":{type : String},
    "productName":String,
    "salePrice":Number,
    "checked":String,
    "productNum":Number,
    "productImage":String
});

module.exports = mongoose.model('Good',productSchema);
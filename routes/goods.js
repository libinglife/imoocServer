/**
 * Created by Libing on 2019/10/18 19:08
 */
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Goods = require('../models/goods');

mongoose.connect("mongodb://127.0.0.1:27017/dumall");

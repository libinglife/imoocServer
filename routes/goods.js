/**
 * Created by Libing on 2019/10/18 19:08
 */
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Goods = require('../models/goods');

mongoose.connect("mongodb://127.0.0.1:27017/imooc");

mongoose.connection.on('connected',()=>{
    console.log("mongoDB connect success");
});
mongoose.connection.on('error',()=>{
    console.log("mongoDB connect fail");
});
mongoose.connection.on('disconnected',()=>{
    console.log('mongoDB disconnected')
});


router.get('/',(req,res,next)=>{
    let page = parseInt(req.param('page'));
    let pageSize = parseInt(req.param('pageSize'));
    let sort = req.param('sort');
    let priceLevel = req.param('priceLevel');

    let params = {} ; //定义查询参数
    let priceGt,priceLet;
    if(priceLevel!="all"){
        switch (priceLevel) {
            case '0':
                priceGt = 0;
                priceLet = 100;
                break;
            case '1':
                priceGt = 100;
                priceLet = 500;
                break;
            case '2':
                priceGt = 500;
                priceLet = 1000;
                break;
            case '3':
                priceGt = 1000;
                priceLet = 5000;
                break;
        }
        params={
            salePrice:{
                $gt:priceGt,
                $lte:priceLet
            }
        }
    }

    let skip = (page - 1) * pageSize;

    let goodsModels = Goods.find(params).skip(skip).limit(pageSize);
    goodsModels.sort({"salePrice":sort});
    goodsModels.exec((err,doc)=>{
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else {
            res.json({
                status:0,
                msg:'',
                result:{
                    total:doc.length,
                    list:doc
                }
            })
        }
    })


    // Goods.find({},(err,doc)=>{
    //     if(err){
    //         res.json({
    //             status:'1',
    //             msg:err
    //         })
    //     }else {
    //         res.json({
    //             status:0,
    //             msg:'',
    //             result:{
    //                 total:doc.length,
    //                 list:doc
    //             }
    //         })
    //     }
    // })
});
//查询商品列表数据
router.get('/list',(req,res,next)=>{
    console.log(req.param);
    res.json(req.param('page'));
    let page = parseInt(req.param.page);
});

module.exports = router;
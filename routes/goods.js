/**
 * Created by Libing on 2019/10/18 19:08
 */
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Goods = require('../models/goods');
let Users = require('../models/user');

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

//查询商品列表数据
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


//添加购物车
router.post('/addCart',(req,res,next)=>{
   let userId = '100000077';
   let productId = req.body.productId;

   Users.findOne({userId:userId}, (err,userDoc) =>{
       if(err){
           res.json({
               status:'1',
               msg:err.message
           })
       }else {
           // console.log("userDoc:"+userDoc);
           if(userDoc){
               let goodsItem ="";
               userDoc.cartList.forEach((item,index)=>{
                  if(item.productId == productId){
                      goodsItem = item;
                      item.productNum++;
                  }
               });

               if(goodsItem){
                   userDoc.save((error,saveDoc)=>{
                       if(error){
                           res.json({
                               status:'1',
                               msg:error.message
                           })
                       }else {
                           res.json({
                               status:'0',
                               msg:'',
                               result:'suc',
                           })
                       }
                   })
               }else {
                   Goods.findOne({productId:productId},(err1,doc1)=>{
                       if(err1){
                           res.json({
                               status:'1',
                               msg:err1.message
                           })
                       }  else {
                           if(doc1){
                               Object.assign(doc1,{
                                   productNum:1,
                                   checked:1
                               });
                               userDoc.cartList.push(doc1);
                               userDoc.save((err2,doc2)=>{
                                   // console.log(doc2);
                                   if(err2){
                                       res.json({
                                           'status':'1',
                                           msg:err2.message
                                       })
                                   }else {
                                       res.json({
                                           status:'0',
                                           msg:'',
                                           result:'suc'
                                       })
                                   }
                               })
                           }
                       }
                   })
               }

           }
       }
   })
});



module.exports = router;
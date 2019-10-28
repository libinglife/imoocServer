var express = require('express');
var router = express.Router();

let userModel = require('./../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource ddd');
});

//登陆
router.post('/login',(req,res,next)=>{
  let param = {
      userName:req.body.userName,
      userPwd:req.body.userPwd
  };
  userModel.findOne(param,(err,userDoc)=>{
    if(err){
      res.json({
          status:'1',
          msg:err.message
      })
    }else {
      res.cookie("userId",userDoc.userId,{
          path:'/',
          maxAge:1000*60*60
      });
      res.cookie("userName",userDoc.userName,{
          path:"/",
          maxAge:1000*60*60
      });
      res.json({
          status:"0",
          msg:'',
          result:{
            userName:userDoc.userName
          }
      })
    }
  })
});

//退出
router.post('/logout',(req,res,next)=>{
   res.cookie("userId",'',{
      path:'/',
      maxAge:-1
   });
   res.json({
       status:'0',
       msg:'退出成功',
       result:""
   })
});

//校验登陆
router.post('/checkLogin',(req,res,next)=>{
    // console.log("----------------");
    // console.log(req);
    if(req.cookies.userId){
      res.json({
          status:'0',
          msg:'登陆成功',
          result:{
            userName:req.cookies.userName || ""
          }
      })
    }else {
        res.json({
            status:'1',
            msg:'暂未登陆',
            result:{}
        })
    }
});


module.exports = router;

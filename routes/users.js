var express = require('express');
var router = express.Router();

let userModel = require('./../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource ddd');
});

router.post('/login',(req,res,next)=>{
  let param = {
      userName:req.body.userName,
      userPwd:req.body.userPwd
  }
  userModel.findOne(param,(err,userDoc)=>{
    if(err){
      res.json({
          status:'1',
          msg:err.message
      })
    }else {
      res.cookie("userId",{
          path:'/',
          maxAge:1000*60*60
      });
      res.cookie("userName",{
          path:"/",
          maxAge:1000*60*60
      });
      res.json({
          status:"0",
          msg:'',
          resuilt:{
            userName:userDoc.userName
          }
      })
    }
  })
});

module.exports = router;

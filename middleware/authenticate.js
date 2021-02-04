
var jwt = require('jsonwebtoken');

module.exports=((req,res,next)=>{
    try{
          let token=req.headers['authorization']
         //console.log(token)
         if(!token){
             res.status(400).json({
                 'statusCode':400,
                'message':'token is empty plz add token in header'})
         }
         else{
         // console.log(Token)
          var decoded = jwt.verify(token, 'LOG_KEY');
        //  console.log(decoded)
            req.userData=decoded;
            next()
         }
    }
    catch(error){
         console.log(error)
        res.status(404).json({
            'statusCode':404,
            'message':'invalid token'})
    }



})
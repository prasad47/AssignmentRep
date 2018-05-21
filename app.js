const express = require('express');
const jwt = require('jsonwebtoken');
var secret = 'Vhl_RRgbicTyuVjYHBTFYzsBL-drRTHoW_XKVsuV-bs';
const app = express();
const bodyParser = require('body-parser')

// Temp Model
var tempUser = {
    "userName":"",
    "password":"",
    "email":"",
    "securedToken":""
};

// config
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Routes

app.get('/api', function(req, res){
  res.json({
    message: 'Api Running Successfully !!'
  });
});

// Register API
app.post('/api/user/register', function(req, res){
    console.log('----------req.body'+JSON.stringify(req.body));
    tempUser = req.body;
    jwt.sign(tempUser, secret, { expiresIn: "30 sec" }, function(err, token) {
        console.log(err)
        if(err){
            res.json(err);
        }
        tempUser.securedToken =token;
        res.json(tempUser);
    });
});

// Login Via API
app.post('/api/user/login', function(req, res)  {
  // Dummy user
  const user =  tempUser;
  jwt.sign(user, secret, { expiresIn: "30 sec" }, function(err, token) {
      console.log(err)
      if(err){
          res.json(err);
      }
      tempUser.securedToken=token;
    res.json(token);
  });
});


// Update Via API
app.post('/api/user/update',verifyToken, function(req, res){
    jwt.verify(req.token, secret, function(err, authData){
        if(err) {
            res.json(err);
        } else {
            tempUser =req.body;
            res.json({message: 'Profile Updated...',user:tempUser});
        }
    });
});


 //Format
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {

  const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
     const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      console.log(bearerToken);
       req.token = bearerToken;
     next();
  } else {
    // Unauthorized
    res.sendStatus(401);
  }

}


//// Validate Token
//function validateToken(req, res, next) {
//    console.log(JSON.stringify(tempUser));
//     if(req.body.securedToken !== undefined || null ){
//
//        console.log('tempUser.securedToken \n ---- '+tempUser.securedToken);
//
//        console.log('req.body.securedToken \n  ---- '+req.body.securedToken);
//
//        if(tempUser.securedToken === req.body.securedToken){
//            next()
//        }else{
//            res.json("Please Check your Credentials ");
//        }
//    }else{
//        res.json("Please Enter Token Along with Credentials !!");
//    }
//}

app.listen(5000,console.log('Server started on port 5000'));
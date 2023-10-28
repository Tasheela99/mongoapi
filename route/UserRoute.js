const express = require('express');
const UserController = require('../controller/UserController');


const router = express.Router();


router.post('/register',UserController.signUp);
router.post('/login',UserController.signIn);


module.exports=router;
const UserSchema = require('../model/UserSchema');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken')


const signUp = async (req, resp) => {
    UserSchema.findOne({email: req.body.email}).then(result => {
        if (result == null) {
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) {
                    return resp.status(500).json({message: 'something went wrong!'});
                }
                const user = new UserSchema({
                    email: req.body.email,
                    fullName: req.body.fullName,
                    password: hash
                });
                user.save().then(savedData => {
                    resp.status(201).json({message: 'user was saved!'});
                }).catch(error => {
                    resp.status(500).json(error);
                })
            });
        } else {
            resp.status(409).json({message: 'username already exists!'});
        }
    }).catch(error => {
        resp.status(500).json(error);
    });
};

const signIn = async (req, resp) => {
    UserSchema.findOne({username: req.body.username}).then(selectedUser => {
        if (selectedUser == null) {
            return resp.status(404).json({message: 'User Not Found'});
        }else {
            bcrypt.compare(req.body.password,selectedUser.password,function (err,result){
               if (err){
                   return resp.status(500).json(err);
               }
               if (result){
                   const expiresIn = 3600;
                   const token = jsonWebToken.sign({'email':selectedUser.email},process.env.SECRET_KEY,{expiresIn});
                   resp.setHeader('Authorization',`Bearer ${token}`)
                   return resp.status(200).json({message:"Check the Headers"});
               }else{
                   return resp.status(401).json({message: 'Password Incorrect'});
               }
            });
        }
    }).catch(error => {
        resp.status(500).json(error);
    });
}

module.exports = {
    signUp,
    signIn
}
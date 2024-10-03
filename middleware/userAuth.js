const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

module.exports =  isAuthenticated = async (req, res, next) => {
    const { token } = req.body;
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ username: data.username });
        if(user){
            if (!bcrypt.compare(data.password, user.password)) {
                return res.status(300).json({
                    error: 'invalid gate way'
                })
            }
            next();
        }else{
            return res.status(300).json({
                error: 'invalid gateway'
            })
        }
    }catch(err){
        return res.status(500).json({
            error: err.message
        })
    }
    
}
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    // console.log(username, password);

    try {
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new userModel({
            username,
            password: hashPassword
        });
        await newUser.save();
        const token = createToken(newUser.username, password);
        return res.status(201).json({
            token: token
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    // console.log(username, password)
    try {
        const user = await userModel.findOne({ username: username });
        if (user && user.verified == true) {
            if (bcrypt.compareSync(password, user.password)) {
                const token = createToken(user.username, password);
                return res.status(200).json({
                    token: token
                });
            } else {
                return res.status(300).json({
                    error: 'invalid username or password'
                })
            }
        } else {
            return res.status(404).json({
                error: 'user not found'
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}

exports.verifyUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);
        if (user) {
            user.verified = true;
            await user.save();
            return res.status(202).json({
                message: 'user verified successfully'
            });
        } else {
            return res.status(404).json({
                error: 'user not found'
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}

exports.rejectUser = async (req, res) =>{
    const {id} = req.params;
    try{
        const user = await userModel.findById(id);
        if(user){
            user.verified = false;
            await user.save();
            return res.status(202).json({
                message: 'user rejected successfully'
            });
        }else{
            return res.status(404).json({
                error: 'user not found'
            });
        }
    }catch(err){
        return res.status(500).json({
            error: err.message
        });
    }
}

exports.auth = async (req, res) => {
    res.status(200).json({
        message: 'successful'
    });
}

const createToken = (username, password) => {
    return jwt.sign({
        username: username,
        password: password
    }, process.env.JWT_SECRET);
}
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

async function registerUser(data, file){
    const { name, email, password, role, committee} = data;

    const existing = await User.findOne({email});
    if (existing) throw new Error("User exist karta hai");

    const userPayload = {
        name,
        email,
        password,
        role,
        committee,
        sign: file ? file.path : null
    };

    const user = await User.create(userPayload);
    const token = generateToken(user);
    return {user, token};
}

async function loginUser (email, password) {

    const user = await User.findOne({email});
    if(!user) throw new Error("Invalid email");

    const isMatch = await user.comparePassword(password);
    if(!isMatch) throw new Error("Invalid password");

    const token = generateToken(user);
    return {user, token};
    
}

exports.register = async (req, res) => {
    try{
        const {user, token} = await registerUser(req.body, req.file);

        res.status(201).json({
            message:"User registered successfully",
            token,
            user,
        });
    } catch (err){
        res.status(400).json({error: err.message});
    }
};

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;

        const {user, token} = await loginUser(email, password);

        res.status(200).json({
            message: "Login successful",
            token, user
        });
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
};
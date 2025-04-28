import userModel from '../models/user_model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

async function signup(req,res){
    const {name, email, password} = req.body;

    const hashed_password = await bcrypt.hash(password, 10);

    try{
        await userModel.create({name, email, password: hashed_password});

        return res.json({
            message: "User created successfully",
        });

    }catch(err){
        if(err.code === 11000){
            return res.status(409).json({
                message: "User already exists",
            });
        }
        console.error(err)
        return res.status(500).json({
            
            message: "Internal server error",
        });   
    }
}

async function signin(req,res){
    const { email, password } = req.body

    const user = await userModel.findOne({email}).select('+password');

    bcrypt.compare(password, user.password, (err, result) => {
        if(err){
            return res.status(500).json({
                message: "Internal server error",
            });
        }
        if(result){
            const token = jwt.sign({id: user._id},process.env.JWT_SECRET)

            return res.status(200).json({
            message: "User signed in successfully",
            token,
        });
        }else{
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }
    }) 
}

export default {signin, signup}
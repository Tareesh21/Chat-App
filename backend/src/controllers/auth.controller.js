import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
    //res.send("Signup Route")
    const {fullName, email, password} = req.body
    try{

        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        //hash password --> No when user enters the password 123456 , we dont want to store it as the same instead we want to store it as a some encrypted format like 'sfjkidhidhidji'.
        if(password.length < 6) {
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }

        //If password is >=6 it executes below line and checks whether the user exists with the email.
        const user = await User.findOne({email})

        if(user) return res.status(400).json({message:"Email already exists"});

        const salt = await bcrypt.genSalt(10)
        //The below line makes for eg:- if user enters 123456 as password then it makes into unreadable format into 'ewqkw_213_321'
        const hashedPassword = await bcrypt.hash(password, salt)

        //The below creates the newUser
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            //generate JWT token here
            //Here mongodb stores id in _id style.
            generateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }else{
            res.status(400).json({message:'Invalid user data'})
        }

    } catch (err){
        console.log("Error in signup controller", error.message)
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const login = async (req, res) => {
    //res.send("Login Route")
    //Now when we are suppose to login, we enter both email and password for logging in
    const {email, password} = req.body

    try{
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"Invalid credentials"})
        }

        //Checking the password entered is correct or not by Comparing the hashed password with the actual password which user entered
       const isPasswordCorrect =  await bcrypt.compare(password, user.password)
       if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"})
       }

       //If the password is correct we can generate the token
       generateToken(user._id, res)

       res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
       })
    }catch(error){
        console.log("Error in login controller", error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const logout = (req, res) => {
    //res.send("Logout Route")
    //If user is trying to logout we need to just clear out the cookies
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"});
    }catch(error){
        console.log("Error in logout controller", error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const updateProfile = async (req, res) => {
    //To update our profile image we need a service, so that we can upload our images into, thi service is cloudinary
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            res.status(400).json({message: 'Profile pic is required'})
        }

        //We have uploaded the image in cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        //We have to update the profilepic in the database for the user
        const updateUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true})

        res.status(200).json(updateUser)

    }catch(error){
        console.log('Error in update profile:', error);
        res.status(500).json({message:"Inetrnal server error"})
    }
}

export const checkAuth = (req, res) => {
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log('Error in checkAuth controller', error.message)
        res.status(500).json({message: 'Internal Server Error'})
    }
}
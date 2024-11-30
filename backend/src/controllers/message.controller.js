import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js"

export const getUsersForSidebar = async(req, res) => {
    //Here we want to fetch every single user, but not ourselves, i.e., we dont want to see ourselves in the contacts list
    try{
        const loggedInUserId = req.user._id
        //find all the users, but do not find the currently logged in user, and we would like to fetch everything expect the password
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select('-password');

        res.status(200).json(filteredUsers)
    }catch(err){
        console.log('Error in getUsersForSidebar: ', err.message)
        res.status(500).json({err: 'Internal server error'})
    }
}

export const getMessages = async(req, res) => {
    try{
        const {id:userToChatId} = req.params
        //The currently authenticated(loogedin) user which is stored in senderId
        const myId = req.user._id

        const messages = await Message.find({
            //to find all the messages where sender is me and receiver is the other user or if the sender is the other user and the receiver is me 
            $or:[
                {senderId: myId, receiverId: userToChatId},
                //or viceversa
                {senderId: userToChatId, receiverId:myId}
            ]
        })

        res.status(200).json(messages)
    }catch(err){
        console.log('Error in getMessages controller: ', err.message)
        res.status(500).json({err:'Internal server error'})
    }
}

export const sendMessage = async(req, res) => {
   //When sending message it can be text or it can be an image.
    try{
        const {text, image} = req.body;
        //The below receiverId is to receive the message from the sender
        const {id: receiverId} = req.params;
        //The below is my id which is stored in senderId
        const senderId = req.user._id;

        let imageUrl;
        //If user sends us the image then we can upload it to cloudinary
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            //The response is stored below
            imageUrl = uploadResponse.secure_url;
        }

        //Creating a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        //for saving the message to the database
        await newMessage.save();

        //todo: real time functionality goes here => socket.io

        res.status(201).json(newMessage)

    }catch(error){
        console.log('Error in sendmessage Controller: ', error.message)
        res.status(500).json({error: 'Internal server error'})
    }
};
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            //The ref property tells Mongoose which model this ObjectId refers to.
            //In this case, "User" is the model name that senderId refers to. It means that this field is a reference to the _id field in the User collection.
            ref: "User",
            required: true,
        },
        receiverId: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    {timestamps: true}
);

const Message = mongoose.model('Message', messageSchema);

export default Message
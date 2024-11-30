import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String, 
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String, 
            default:"",
        },
    },
        { timestamps: true}
);

//However we have created User here we, can see it as users in mongodb.
const User = mongoose.model('User', userSchema)

export default User;
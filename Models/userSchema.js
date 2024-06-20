import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        username: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        password: { 
            type: String, 
            required: true 
        },
        repeatPassword: { 
            type: String, 
            required: true
        },
        resetToken: { 
            type: String 
        }, 
        resetTokenExpiry: { 
            type: Date
        },
        isActive: { 
            type: Boolean, 
            default: false 
        },
        activationToken: { 
            type: String 
        }
},{timestamps: true});

const User = mongoose.model('User',userSchema)

export default User;
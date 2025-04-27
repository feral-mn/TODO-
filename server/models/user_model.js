import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [20, 'Name cannot be more than 20 characters'],
        minlength: [3, 'Name must be at least 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
        maxlength: [40, 'Email cannot be more than 40 characters']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must be at least 8 characters'],
        maxlength: [20, 'Name cannot be more than 20 characters'],
        select: false // Never show password in queries
    },
}, {timestamps: true}); // Adds createdAt and updatedAt automatically

const userModel = mongoose.model('user', userSchema);

export default userModel;

import mongoose from 'mongoose';

const todoSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",  // Capitalized to match the model name convention
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,  // Automatically trim whitespace
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {  // Optional: Add description field
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    completed: {
        type: Boolean,
        default: false
    },
    dueDate: {  // Optional: Add due date functionality
        type: Date,
        validate: {
            validator: function(date) {
                return date > new Date();
            },
            message: 'Due date must be in the future'
        }
    },
},{timestamps: true}); // Adds createdAt and updatedAt automatically// 


const todoModel = mongoose.model('todo', todoSchema);

export default todoModel;
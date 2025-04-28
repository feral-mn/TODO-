// Description: This is the entry point of the server application. 
// It sets up the server, connects to the database, and defines the routes for the application.
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './mongoose.js'
import api_routes from './routes/api_routes.js'
// import todo_routes from './routes/todo_routes.js'
import user_routes from './routes/user_routes.js'


dotenv.config() // Load environment variables from .env file
const app = express()// Initialize express app
connectDB();// Connect to MongoDB
app.use(express.json());// for parsing application/json
app.use(cors()) // for enabling CORS


// Define routes
app.use('/', api_routes); // API route
app.use('/user', user_routes); // User authentication routes
// app.use('/todo', todo_routes); // Todo management routes


// Start the server
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

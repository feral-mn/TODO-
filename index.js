import express from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'

const app = express()
app.use(express.json());// for parsing application/json
app.use(cors()) // for enabling CORS

let USERS = []
let JWT_SIGN = "yoyoyoyo"

app.get('/', function(req,res){
    res.send('Hello World')
})

app.post('/signup', function(req,res){
    const { username, password } = req.body
    let todo = []
    if(!username || !password){
        return res.status(400).json({error: 'Username and password are required'})
    }
    if(username.length < 4|| password.length < 4){
        return res.status(400).json({error: 'Credentials must be at least 4 characters long'})
    }
    
    USERS.push({username: username, password: password, todo: todo})    

    res.status(201).json({message: 'User created successfully'})
})

app.post('/signin', function(req,res){
    const { username, password } = req.body
    
    if(!username || !password){
        return res.status(400).json({error: 'Username and password are required'})
    }
    if(username.length < 4|| password.length < 4){
        return res.status(400).json({error: 'Credentials must be at least 4 characters long'})
    }

    const founduser = USERS.find(user=> user.username === username && user.password === password)
    if(!founduser){
        return res.status(401).json({error: 'Invalid credentials'})
    }else{
        const token = jwt.sign({username : username},JWT_SIGN)
        res.status(200).json({message: 'User signed in successfully', token: token})
    }
})

// Middleware to check if the user is authenticated
function auth(req, res, next) {
    const token = req.headers.token
    if (!token) {
        return res.status(401).json({ error: 'Send Token' })
    }
    const verified = jwt.verify(token, JWT_SIGN)
    if(!verified) {
        return res.status(401).json({ error: 'Unauthorized' })
    }else{
        req.username = verified.username
        next()
    }

}

app.get('/todos', auth,function(req,res){
    const username = req.username
    const found_todo = USERS.find(user => user.username === username)
    if(!found_todo){
        return res.status(200).json({message: 'Not Authorised'})
    }else{
        res.status(200).json({todo: found_todo.todo})
    }
    console.log(USERS)
})

app.post('/todos',auth, function(req,res){
const username = req.username
const todo_title= req.body.title

const found_user = USERS.find(user => user.username === username)
//creating a new todolist

let todolist = {id: Object.entries(found_user.todo).length+1, title: todo_title, done: false}

USERS[USERS.indexOf(found_user)].todo.push(todolist)

res.status(201).json({message: 'Todo created successfully', fullarray: USERS} )

})

app.put('/todos/:id', auth, function(req,res){
const username = req.username
const todo_id = req.params.id
const todo_title = req.body.title

const found_user = USERS.find(user => user.username === username)
const found_todo = found_user.todo.find(todo => todo.id == todo_id)
if(!found_todo){
    return res.status(404).json({error: 'Todo not found'})
}else{
    found_todo.title = todo_title
    res.status(200).json({message: 'Todo updated successfully', todo: found_todo})
}
})

app.delete('/todos/:id', auth, function(req,res){
    const username = req.username
    const todo_id = req.params.id
    const found_user = USERS.find(user => user.username === username)
    const found_todo = found_user.todo.find(todo => todo.id == todo_id)
    if(!found_todo){
        return res.status(404).json({error: 'Todo not found'})
    }else{
        found_user.todo.splice(found_user.todo.indexOf(found_todo), 1)
        res.status(200).json({message: 'Todo deleted successfully', todo: found_user})
    }
})

app.put('/todos/:id/done', auth, function(req,res){
    const username = req.username
    const todo_id = req.params.id
    
    const found_user = USERS.find(user => user.username === username)
    const found_todo = found_user.todo.find(todo => todo.id == todo_id)
    if(!found_todo){
        return res.status(404).json({error: 'Todo not found'})
    }else{
        found_todo.done = !found_todo.done
        res.status(200).json({message: 'Todo updated successfully', todo: found_user})
    }
    })

app.listen(3000)
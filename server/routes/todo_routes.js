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
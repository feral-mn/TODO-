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
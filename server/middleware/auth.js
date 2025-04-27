import jwt from 'jsonwebtoken'

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

export default auth
const jwt = require ('jsonwebtoken');

let checkToken = (req, res, next) => {
    let authToken = req.headers["authorization"]
    if(!authToken){
        res.status(401).send({ message: 'Token de acesso requerido.' })
    }
    else{
        let token = authToken.split(' ')[1]
        req.token = token
    }

    jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
        if(err){
            res.status(401).send({ message: 'Acesso negado.' })
            return
        }
        
        req.userId = decodeToken.id
        next()
    })
};

module.exports = { checkToken };
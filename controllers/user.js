const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');

const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
});

exports.register = (req, res) => {
    let passwordHash = bcrypt.hashSync(req.body.password, 8)

    knex('user')
        .insert({
            email: req.body.email,
            password: passwordHash
        }, ['id', 'email'])
        .then((result) => {
            let user = result[0]
            res.status(200).send({
                "id": user.id,
                "email": user.email
            })
            return
        })
        .catch(err => {
            res.status(500).send({ message: 'Erro ao registrar o usuário - ' + err.message })
        })
};

exports.login = (req, res) => {
    knex
        .select('*')
        .from('user')
        .where({ email: req.body.email })
        .then( users => {
            if(users.length){
                let user = users[0]

                let checkSenha = bcrypt.compareSync(req.body.password, user.password)
                if(checkSenha) {
                    var tokenJWT = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
                        expiresIn: 3600
                    })

                    res.status(200).send({
                        id: user.id,
                        email: user.email,
                        token: tokenJWT
                    })
                    return
                }
            }

            res.status(200).send({ message: 'O e-mail não é registrado ou a senha está incorreta.' })
        })
        .catch(err => {
            res.status(500).send({ message: 'Erro ao verificar login do usuário - ' +  err.message })
        })
};
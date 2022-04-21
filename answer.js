const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
});

exports.create = (req, res) => {
    knex('answer')
        .insert({ value: req.body.value, 
                  survey_id: req.body.survey_id}, 
                ['id', 'value'])
        .then(result => {
            let new_answer = result[0];
            res.status(201).send({ message: 'Resposta inserida com sucesso.', id: new_answer.id })
        })
};
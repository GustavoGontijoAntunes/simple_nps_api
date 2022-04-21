const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
});

exports.getInProgress = (req, res) => {
    knex.select('*')
        .from('survey')
        .whereNull('completion_date')
        .then(surveys => {
            res.status(200).send(surveys);
        })
};

exports.getFinished = (req, res) => {
    knex.select('*')
        .from('survey')
        .whereNotNull('completion_date')
        .then(surveys => {
            res.status(200).send(surveys);
        })
};

exports.create = (req, res) => {
    knex('survey')
        .insert({ title: req.body.title, 
                  user_id: req.body.user_id}, 
                ['id', 'title'])
        .then(result => {
            let new_survey = result[0];
            res.status(201).send({ message: 'Pesquisa inserida com sucesso.', id: new_survey.id })
        })
};

exports.updateCompletionDate = (req, res) => {
    knex('survey')
        .where({
            id: req.params.id
        })
        .update({ completion_date: req.body.completion_date}, 
            ['id', 'title', 'completion_date'])
        .then(u => {
            let existing_survey = u[0];
            if(u && existing_survey != null) {
                res.status(201).send({ message: 'Pesquisa alterada com sucesso.', id: existing_survey.id })                
            }            
            else{
                res.status(404).send({ message: 'Pesquisa não encontrado para exclusão.' });
            }
        })
        .catch(err => {
            res.status(500).send({ message: 'Erro na alteração.\nMensagem: ' + err.message });
        })
};

exports.result = (req, res) => {
    knex
        .raw(
        'select ( ' + 
            '(select ( ' +
                'select count(a.*) ' +
                'from public.answer a ' +
                'where a.survey_id = ? and a.value in (9, 10) ' +
                'group by a.survey_id ' +
            ') * 100 / ( ' +
                'select count(b.*) ' +
                'from public.answer b ' +
                'where b.survey_id = ? ' +
                'group by b.survey_id ' +
            ') promotores) '+
        '- ' +
            '(select (' +
                'select count(c.*) ' +
                'from public.answer c ' +
                'where c.survey_id = ? and c.value in (0, 1, 2, 3, 4, 5, 6) ' +
                'group by c.survey_id' +
            ') * 100 / ( ' +
                'select count(d.*) ' +
                'from public.answer d ' +
                'where d.survey_id = ? ' +
                'group by d.survey_id ' +
            ') detratores) ' +
        ') resultado ', [req.params.survey_id, req.params.survey_id, req.params.survey_id, req.params.survey_id]
        )
        .then(result => {
            if(result != null) {
                res.status(200).send(result);
            }
            else{
                res.status(404).send({ message: 'O resultado não pôde ser calculado.' });
            }
        })
};


exports.numberOfAnswers = (req, res) => {
    knex
        .raw(
            'select count(a.*) resultado ' +
            'from public.answer a ' +
            'where a.survey_id = ? ' +
            'group by a.survey_id ', [req.params.survey_id]
        )
        .then(result => {
            if(result != null) {
                res.status(200).send(result);
            }
            else{
                res.status(404).send({ message: 'O número total de respostas não pôde ser calculado.' });
            }
        })
};

exports.numberOfNeutrals = (req, res) => {
    knex
        .raw(
            'select count(a.*) resultado ' +
            'from public.answer a ' +
            'where a.survey_id = ? ' +
            'and a.value in (7, 8) ' +
            'group by a.survey_id ', [req.params.survey_id]
        )
        .then(result => {
            if(result != null) {
                res.status(200).send(result);
            }
            else{
                res.status(404).send({ message: 'O número de neutros não pôde ser calculado.' });
            }
        })
};

exports.numberOfPromoters = (req, res) => {
    knex
        .raw(
            'select count(a.*) resultado ' +
            'from public.answer a ' +
            'where a.survey_id = ? ' +
            'and a.value in (9, 10) ' +
            'group by a.survey_id ', [req.params.survey_id]
        )
        .then(result => {
            if(result != null) {
                res.status(200).send(result);
            }
            else{
                res.status(404).send({ message: 'O número de promotores não pôde ser calculado.' });
            }
        })
};

exports.numberOfDetractors = (req, res) => {
    knex
        .raw(
            'select count(a.*) resultado ' +
            'from public.answer a ' +
            'where a.survey_id = ? ' +
            'and a.value in (0, 1, 2, 3, 4, 5, 6) ' +
            'group by a.survey_id ', [req.params.survey_id]
        )
        .then(result => {
            if(result != null) {
                res.status(200).send(result);
            }
            else{
                res.status(404).send({ message: 'O número de detratores não pôde ser calculado.' });
            }
        })
};
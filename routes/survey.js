const express = require('express');
const routerSurvey = express.Router();
const surveyController = require('../controllers/survey.js');
const utilSec = require('../utils/security.js');

routerSurvey.get('/inProgress', utilSec.checkToken, surveyController.getInProgress);
routerSurvey.get('/finished', utilSec.checkToken, surveyController.getFinished);
routerSurvey.post('/create', utilSec.checkToken, surveyController.create);
routerSurvey.patch('/updateCompletionDate/:id', utilSec.checkToken, surveyController.updateCompletionDate);
routerSurvey.get('/result/:survey_id', utilSec.checkToken, surveyController.result);
routerSurvey.get('/numberOfAnswers/:survey_id', utilSec.checkToken, surveyController.numberOfAnswers);
routerSurvey.get('/numberOfNeutrals/:survey_id', utilSec.checkToken, surveyController.numberOfNeutrals);
routerSurvey.get('/numberOfPromoters/:survey_id', utilSec.checkToken, surveyController.numberOfPromoters);
routerSurvey.get('/numberOfDetractors/:survey_id', utilSec.checkToken, surveyController.numberOfDetractors);

module.exports = routerSurvey;
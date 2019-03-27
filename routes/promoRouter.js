const express = require('express');
const bodyParser = require('body-parser');
const promoRouter = express.Router();
const Promotions = require('../models/Promotions');
const authenticate = require('../authenticate');
const cors = require('./cors');


// Configure body-parser to be able read incoming json data
promoRouter.use(bodyParser.json());

// Create API endpoints
promoRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Promotions.find({})
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(promotions);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        Promotions.create(req.body)
            .then((promotion) => {
                console.log('Promotion Created', promotion);
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Promotions');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Promotions.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


promoRouter.route('/:promoId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res) => {
        Promotions.findById(req.params.promoId)
            .then((promotion) => {
                if (promotion != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(promotion);
                } else {
                    err = new Error("Promotion " + req.params.promoId + " not found.");
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('Post operation is not supported on /promotions' + req.url);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        Promotions.findByIdAndUpdate(req.params.promoId, {
                $set: req.body
            }, { new: true })
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(promotions);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        Promotions.findByIdAndRemove(req.params.promoId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// Export the module
module.exports = promoRouter;
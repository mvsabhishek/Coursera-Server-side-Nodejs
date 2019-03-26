const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const leaderRouter = express.Router();
const Leaders = require('../models/Leaders');
// Configure body-parser to be able read incoming json data
leaderRouter.use(bodyParser.json());

// Create API endpoints
leaderRouter.route('/')
    .get((req, res, next) => {
        Leaders.find({})
            .then((leaders) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(leaders);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyuser, (req, res) => {
        Leaders.create(req.body)
            .then((leader) => {
                console.log('Leader Created', leader);
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyuser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Leaders');
    })
    .delete(authenticate.verifyuser, (req, res, next) => {
        Leaders.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


leaderRouter.route('/:leaderId')
    .get((req, res) => {
        Leaders.findById(req.params.leaderId)
            .then((leader) => {
                if (leader != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(leader);
                } else {
                    err = new Error("Leader " + req.params.leaderId + " not found.");
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyuser, (req, res) => {
        res.statusCode = 403;
        res.end('Post operation is not supported on /Leaders' + req.url);
    })
    .put(authenticate.verifyuser, (req, res) => {
        Leaders.findByIdAndUpdate(req.params.leaderId, {
                $set: req.body
            }, { new: true })
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyuser, (req, res) => {
        Leaders.findByIdAndRemove(req.params.leaderId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


// Export the module
module.exports = leaderRouter;
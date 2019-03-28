const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const favouriteRouter = express.Router();
const Favourites = require('../models/Favourites');

const cors = require('./cors');

// Configure body-parser to be able read incoming json data
favouriteRouter.use(bodyParser.json());

// Create API endpoints
favouriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    //Get all favourites for the authorized user
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favourites) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(favourites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    // Post multiple favourite dishes
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        // Dishes to be posted as {"_id": ["a12312asd", "adasdasd12"]} 
        // It is best practice not to have Duplicate Keys ("_id") in JSON document
        Favourites.findOne({ user: req.user._id })
            .then((favourite) => {
                // If favourite document exists for the user
                if (favourite != null) {
                    for (var i in req.body._id) {
                        if (favourite.dishes.indexOf(req.body._id[i]) === -1) {
                            favourite.dishes.push(req.body._id[i]);
                        }
                    }
                    favourite.save()
                        .then((favourite) => {
                            Favourites.findOne({ user: req.user._id })
                                .populate('user')
                                .populate('dishes')
                                .then((favourite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-type', 'application/json');
                                    res.json(favourite);
                                })
                        }, (err) => next(err));
                } else {
                    // Dishes to be posted as {"_id": ["a12312asd", "adasdasd12"]} 
                    // It is best practice not to have Duplicate Keys ("_id") in JSON document
                    // If favourite document doesn't exist for the user
                    var dish_arr = [];
                    for (var i in req.body._id) {
                        dish_arr.push(req.body._id[i]);
                    }
                    Favourites.create({
                            user: req.user._id,
                            dishes: dish_arr
                        })
                        .then((favourite) => {
                            Favourites.findOne({ user: req.user._id })
                                .populate('dishes')
                                .then((favourite) => {
                                    console.log('Favourite Created!', favourite);
                                    res.statusCode = 200;
                                    res.setHeader('Content-type', 'application/json');
                                    res.json(favourite);
                                }, (err) => next(err))
                        })
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Favourites');
    })
    // Delete the favourite document for the user
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.remove({ user: req.user._id })
            .then(() => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ "Status": "Success" });
            }, (err) => next(err))
            .catch((err) => next(err));
    });


favouriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /Favourites');
    })
    // POST a new dish with dishId as favourite for the user
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .then((favourite) => {
                // If favourite document already exists
                if (favourite != null) {
                    if (favourite.dishes.indexOf(req.params.dishId) === -1) {
                        favourite.dishes.push(req.params.dishId);
                        favourite.save()
                            .then(() => {
                                Favourites.findOne({ user: req.user._id })
                                    .populate('user')
                                    .populate('dishes')
                                    .then((favourite) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-type', 'application/json');
                                        res.json(favourite);
                                    }, (err) => next(err))
                            }, (err) => next(err))
                    } else {
                        // If dishId already is in the dishes array
                        res.statusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.json({ 'alreadyFavourite': 'This dish is already a favourite' });
                    }
                } else {
                    // If favourite document doesn't exist for the user 
                    Favourites.create({ user: req.user._id, dishes: [req.params.dishId] })
                        .then((favourite) => {
                            Favourites.findOne({ user: req.user._id })
                                .populate('user')
                                .populate('dishes')
                                .then((favourite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-type', 'application/json');
                                    res.json(favourite);
                                }, (err) => next(err))
                        }, (err) => next(err))
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Favourites');
    })
    // DELETE a dish with dishId from favourites document for the user
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .then((favourite) => {
                for (var i in favourite.dishes) {
                    if (favourite.dishes[i] == req.params.dishId) {
                        favourite.dishes.splice(i, 1)
                    }
                }
                favourite.save()
                    .then(() => {
                        Favourites.findOne({ user: req.user._id })
                            .populate('user')
                            .populate('dishes')
                            .then((favourite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-type', 'application/json');
                                res.json(favourite);
                            }, (err) => next(err))
                    }, (err) => next(err))

            }, (err) => next(err))
            .catch((err) => next(err))
    })




module.exports = favouriteRouter;
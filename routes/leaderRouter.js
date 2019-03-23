const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

// Configure body-parser to be able read incoming json data
leaderRouter.use(bodyParser.json());

// Create API endpoints
leaderRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end('Will send all the leaders to you!');
    })
    .post((req, res) => {
        res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete((req, res) => {
        res.end('Deleting all leaders');
    });

leaderRouter.route('/:leaderId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end('Will send the leader: ' + req.params.leaderId + ' to you!');
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end('Post operation is not supported on /leaders' + req.url);
    })
    .put((req, res) => {
        res.write('Updating the leader: ' + req.params.leaderId + '\n');
        res.end('Will update the leader: ' + req.body.name + ' with description: ' + req.body.description + '.');
    })
    .delete((req, res) => {
        res.end('Deleting the leader: ' + req.params.leaderId);
    });


// Export the module
module.exports = leaderRouter;
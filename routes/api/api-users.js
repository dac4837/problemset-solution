var express = require('express');
var router = express.Router();
var UserService = require('../UserService');

//Get all users
router.get('/', (req, res, next) => {
    UserService.getAllUsers()
    .then((users)=>{
        res.status(200);
        res.json(users);
    });
});

//Get one user
router.get('/:username', (req, res, next) => {
    UserService.getUser(req.params.username)
    .then((user)=>{
        res.status(200);
        res.json(user);
    })
    .catch((err)=>{
        if (err.statusCode) res.status(err.statusCode);
        else res.status(500);
        //Send server error to client
        res.send(JSON.stringify({error: err.message}));
        res.end(); 
    });
});

//Edit one user
router.put('/:username', (req, res, next) => {

    UserService.updateUser(req.params.username, req.body)
        .then((user)=>{
            res.status(200);
            res.json(user);
        })
        .catch((err)=>{
            //Send error to client. It's likely an issue with Id or username so 400 client error.
            if (err.statusCode) res.status(err.statusCode);
            else res.status(500);
            res.send(JSON.stringify({error: err.message}));
            res.end();
        });
});

//Create one user
router.post('/', (req, res, next) => {
	console.log("************* CREATING USER");

    UserService.createUser(req.body)
        .then((user)=>{
            res.status(201);
            res.json(user);
        })
        .catch((err)=>{
            //Send error to client.
            if (err.statusCode) res.status(err.statusCode);
            else res.status(500);;
            res.send(JSON.stringify({error: err.message}));
            res.end();
        });
});

//Delete one user
router.delete('/:username', (req, res, next) => {
    UserService.deleteUser(req.params.username)
        .then(()=>{
            res.status(200);
            res.end();
        })
        .catch((err)=>{
            //Send error to client. It's likely an issue with Id or username so 400 client error.
            if (err.statusCode) res.status(err.statusCode);
            else res.status(500);
            res.send(JSON.stringify({error: err.message}));
            res.end();
        });
});


module.exports = router;

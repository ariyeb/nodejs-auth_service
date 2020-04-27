const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/signup', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.userName, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/new-token', auth, async (req, res) => {
    try {
        const user = req.user;
        const token = await user.generateAuthToken();
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e);
    }
})

router.get('/check-token', auth, async (req, res) => {
    res.send({ user: req.user, token: req.token })
})

module.exports = router;
const express = require('express');
const router = express.Router({
	mergeParams: true
});
// const Moralis  = require('moralis/node');

// Moralis.initialize("dUMJfv2n7gRdbxFXXA2GOzOBJZCIh8BIA1i5sGUO");
// Moralis.serverURL = 'https://8k58x9n5vu6p.moralis.io:2053/server'

router.get('/', (req, res) => {
	res.render('home');
});

router.get('/logo', (req, res) => {
	res.render('logo');
});

module.exports = router;
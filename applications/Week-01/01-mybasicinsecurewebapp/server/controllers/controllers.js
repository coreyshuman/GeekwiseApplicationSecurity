const CarController = require('./car.controller');
const express = require('express');
const router = express.Router();

const carController = new CarController(router);

module.exports = router;
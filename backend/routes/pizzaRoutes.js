const express = require('express');
const router = express.Router();
const Pizza = require('../models/Pizza');

// Get all pizzas
router.get('/', async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a pizza
router.post('/', async (req, res) => {
  const pizza = new Pizza(req.body);
  try {
    const newPizza = await pizza.save();
    res.status(201).json(newPizza);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');

const app = express();

//MongoDB database connections
mongoose
    .connect('mongodb+srv://biosmatrix:L3RKEOJf1FVhQ06y@cluster0-pjzkd.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

//handles CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// returns the recipe with the provided ID from the database
app.get('/api/recipes/:id', (req, res) => {
    const { id } = req.params;
    Recipe.findById(id)
        .then(recipe => {
            res.status(200).json(recipe);
        })
        .catch(error => {
            res.status(404).json({
                error: error
            });
        });
});

//returns all recipes in database
app.get('/api/recipes', (req, res) => {
    Recipe.find({})
        .then(recipes => {
            res.status(200).json(recipes);
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
});

//adds a new recipe to the database
app.post('/api/recipes', (req, res) => {
    const { title, ingredients, instructions, difficulty, time } = req.body;
    const newRecipe = new Recipe({
        title,
        ingredients,
        instructions,
        difficulty,
        time
    });
    newRecipe
        .save()
        .then(() => {
            res.status(201).json({
                message: 'Recipe was saved successfully!'
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
});

//modifies the recipe with the provided ID
app.put('/api/recipes/:id', (req, res) => {
    const { id } = req.params;
    const { title, ingredients, instructions, difficulty, time } = req.body;
    const update = {
        title,
        ingredients,
        instructions,
        difficulty,
        time
    };
    Recipe.findByIdAndUpdate(id, update)
        .then(() => {
            res.status(201).json({
                message: 'Recipe updated successfully!'
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
});

//deletes the recipe with the provided ID
app.delete('/api/recipes/:id', (req, res) => {
    const { id } = req.params;
    Recipe.findByIdAndDelete(id)
        .then(() => {
            res.status(200).json({
                message: 'Recipe was Deleted!'
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
});

module.exports = app;

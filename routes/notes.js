'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config')
const Note = require('../models/note');

const express = require('express');
// Create an router instance (aka "mini-app")
const router = express.Router();

/* ========== GET/READ ALL ITEM ========== */
router.get('/notes', (req, res, next) => {

      const { searchTerm } = req.query;
      let filter = {};

      if (searchTerm) {
        const re = new RegExp(searchTerm, 'i');
        filter.title = { $regex:re }; 
      }
      Note.find(filter)
        .sort('created')
        .then(results => {
            res.json(results);
        })
        .catch(console.error);

  // console.log('Get All Notes');
  // res.json([
  //   { id: 1, title: 'Temp 1' }, 
  //   { id: 2, title: 'Temp 2' }, 
  //   { id: 3, title: 'Temp 3' }
  // ]);

});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/notes/:id', (req, res, next) => {

  const searchId = req.params.id;

  Note.findById(searchId)
    .then(results => {
        res.json(results);
        console.log('FindById done')
    })
    .catch(console.error);

  // console.log('Get a Note');
  // res.json({ id: 2 });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/notes', (req, res, next) => {

  const { title, content } = req.body;

  if (!title) {
    const error = new Error(`missing title in req.body`)
    error.status = 400;
    return next(error);
  }

  const newItem = {title, content};

    Note.create(newItem)
      .then((results) => {
          console.log(results);
          res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
      })
    .catch(next)

  // console.log('Create a Note');
  // res.location('path/to/new/document').status(201).json({ id: 2 });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {

    const searchId = req.params.id;
    const updateIt = {
        title: req.body.title,
        content: req.body.content
    }
    Note.findByIdAndUpdate(searchId, updateIt, { new: true })
    .then((results) => {
        res.json(results);
    })
    .catch(console.error)

  // console.log('Update a Note');
  // res.json({ id: 2 });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {
  const searchId = req.params.id;
  Note.findByIdAndRemove(searchId)
  .then((results) => {
    if(results) {
      res.status(204).end();
    } else {
      next();
    }
  })
  .catch((err) => next(err));

  // console.log('Delete a Note');
  // res.status(204).end();

});

module.exports = router;
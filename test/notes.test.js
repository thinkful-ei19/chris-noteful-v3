'use strict';
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');
const seedNotes = require('../db/seed/notes');

const chaiSpies = require('chai-spies');
const expect = chai.expect;

chai.use(chaiHttp);
chai.use(chaiSpies);


describe('Test notes.js', () => {
    //connect to TestDB
    before(function() {
      return mongoose.connect(TEST_MONGODB_URI);
    });
    //seed the DB before each test
    beforeEach(function() {
      return Note.insertMany(seedNotes)
        .then(() => Note.createIndexes());
    });
    //Drop the db after each test
    afterEach(function() {
      return mongoose.connection.db.dropDatabase();
    });
    //Disconnect after all tests complete
    after(function() {
      return mongoose.disconnect();
    });
  
    describe('GET /api/notes', function() {
      it('should return all existing notes with the right fields', function() {
        let res;
        return chai.request(app)
          .get('/api/notes')
          .then(function(_res) {
            res = _res;
            expect(res).to.have.status(200);
          })
          .then(() => {
            expect(res.body).to.be.a('array')
            expect(res.body).to.have.length.of.at.least(1);
            res.body.forEach((object) => {
              expect(object).to.be.a('object');
              expect(object).to.include.keys('id', 'title', 'content');
            })
          })
      });
    })
  
    describe('GET /api/notes/:id', function() {
      it('should return correct notes', function() {
        let testObj;
        return Note.findOne()
        .select('id title content')
          .then((result) => {
            testObj = result;
            return chai.request(app)
            .get(`/api/notes/${testObj.id}`)
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res.body.title).to.equal(testObj.title);
              expect(res.body.content).to.equal(testObj.content);
              expect(res.body.id).to.equal(testObj.id);
            })
          })
      })
      it('should return an error with a non-existent id', function() {
        let fakeId = '000000434300000000000002';
        return chai.request(app)
            .get(`/api/notes/${fakeId}`)
            .catch((err) => err.response)
            .then((res) => {
                expect(res).to.have.status(404);
            })
      })
      it('should return with an error when given an improperly formatted id', function() {
        let fakeId = '12-64/5645';
        return chai.request(app)
            .get(`/api/notes/${fakeId}`)
            .catch((err) => err.response)
            .then((res) => {
            expect(res).to.have.status(404);
            })
      })
    })
  
    describe('GET /api/notes/?searchTerm=', function () {
      it('should return the proper searchquery item', function() {
        let searchTerm = 'cats';
        let test = true;
        return chai.request(app)
          .get(`/api/notes/?searchTerm=${searchTerm}`)
          .then((res) => {
            expect(res).to.have.status(200);
            res.body.forEach((item) => {
              if (item.title.indexOf(searchTerm) == -1) {
                test = false
              }
              expect(item).to.be.a('object');
              expect(item).to.include.keys('id', 'title', 'content');
            })
          })
          .then(() => {
            expect(test).to.be.true;
          })
      })
    it('should give an empty array if a search item does not exist', function() {
        let searchTerm = 'giorengoirengreionhreiohnreiohnascpoqwmrx123zcmnmqwpr';
        let test = true;
        return chai.request(app)
          .get(`/api/notes/?searchTerm=${searchTerm}`)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('array');
            expect(res.body[0]).to.be.undefined;
          })

    })
    })
  
    describe('POST /api/notes', function() {
      it('should create and return a new item when provided valid data', function () {
        /*Create a new item, POST it and set body to equal the new item. Get a response from the 
        POST request and compare the POST to the body*/
        const newItem = {
          'title': 'The best article about cats ever!',
          'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
          'tags': []
        };
        let body;
        // 1) Call the API first with the POST req and test attributes
        return chai.request(app)
          .post('/api/notes')
          .send(newItem)
          .then(function (res) {
            body = res.body;
            expect(res).to.have.status(201);
            expect(res).to.have.header('location');
            expect(res).to.be.json;
            expect(body).to.be.a('object');
            expect(body).to.include.keys('id', 'title', 'content');
            // 2) 'Then' call the database
            return Note.findById(body.id);
          })
          // 3) 'Then' compare the database with the response
          .then((data) => {
            expect(body.title).to.equal(data.title);
            expect(body.content).to.equal(data.content);
          });
      });
      it('should return an error when missing a "title"', function() {
        const newItem = {
          'content': 'Chickens love chickens'
        };
        return chai.request(app)
          .post('/api/notes')
          .send(newItem)
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal(`missing title in req.body`);
          });
      })
    });
  
    describe('PUT /api/notes/:id', function() {
      /*Get an existing datapiece, do a PUT req with it, then compare*/
      it('should update the values of an existing item with valid data provided', function() {
        let data = {
          'title': 'Why cats love cheese',
          'content': 'Because who does not love cheese?'
        };
        return Note.findOne().select('id title content')
          .then(_data => {
            data.id = _data.id;
            return chai.request(app)
              .put(`/api/notes/${data.id}`)
              .send(data);
          })
          .then((res) => {
            expect(res).to.have.status(200);
            return Note.findById(data.id)
          })
          .then((result) => {
            expect(result.title).to.equal(data.title);
            expect(result.content).to.equal(data.content);
          })
      })
      it('should return with an error when given an improperly formatted id (PUT)', function() {
        let fakeId = '12-64/5645';
        return chai.request(app)
            .put(`/api/notes/${fakeId}`)
            .catch((err) => err.response)
            .then((res) => {
            expect(res).to.have.status(404);
            })
      })
      it('should return an error with a non-existent id (PUT)', function() {
        let fakeId = '000000434300000000000002';
        return chai.request(app)
            .get(`/api/notes/${fakeId}`)
            .catch((err) => err.response)
            .then((res) => {
                expect(res).to.have.status(404);
            })
      })
      it('should return an error when missing a "title" (PUT)', function() {
        const newItem = {
          'content': 'Chickens love chickens'
        };
        return chai.request(app)
          .post('/api/notes')
          .send(newItem)
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(400);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal(`missing title in req.body`);
          });
      })
    });
  
    describe('DELETE /api/notes/:id', function() {
  
      it('should get an item ID and delete it with status 204, then return null', function() {
        let doc;
        return Note.findOne()
        .select('id title content')
        .then((result) => {
          doc = result;
          return chai.request(app)
            .delete(`/api/notes/${doc.id}`)
        })
        .then((res) => {
          expect(res).to.have.status(204);
        })
      })
      it('should return an error if the id is falsey', function() {
        let fakeId = '000000434300000000000002';
        return chai.request(app)
          .del(`/api/notes/${fakeId}`)
          .catch((err) => err.response)
          .then((res) => {
            expect(res).to.have.status(404);
          })
      })
    })
  });
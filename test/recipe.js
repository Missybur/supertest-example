'use strict';

var request = require('supertest')
, assert = require('assert')
, mongoose = require('mongoose')
, app = require('../app');

describe('Recipe API', function() {
  var id, recipe;

  recipe = {
    title: "Pancakes"
    , description: 'The best pancakes!'
    , readyIn: '20 min'
    , method: 'To make the best pancakes do this..'
    , ingredients: [
      { name: 'eggs', amount: '2' },
      { name: 'plain flour', amount: '100g' },
      { name: 'milk', amount: '300ml' }
    ]
  };

  beforeEach(function(done) {
    mongoose.connection.collections['recipes'].drop(function(err) {
      mongoose.connection.collections['recipes'].insert(recipe, function(err, docs) {
        id = docs[0]._id;
        done();
      });
    });
  });

  describe('GET /recipes', function() {
    describe('when requesting resource /recipes', function() {
      it('should return an array of recipes', function(done) {
        request(app)
        .get('/recipes')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          var result = JSON.parse(res.text)[0];
          assert.equal(result._id, id);
          assert.equal(recipe.title, result.title);
          assert.equal(recipe.description, result.description);
          assert.equal(recipe.readyIn, result.readyIn);
          assert.equal(recipe.method, result.method);
          assert.equal(recipe.ingredients.length, result.ingredients.length);
          done();
        });
      });
    });
  });

  describe('GET /recipes/:id', function() {
    describe('when requesting resource /recipe/:id with a valid id', function() {
      it('should return the recipe', function(done) {
        request(app)
        .get('/recipes/' + id)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          var result = JSON.parse(res.text);
          assert.equal(result._id, id);
          assert.equal(recipe.title, result.title);
          assert.equal(recipe.description, result.description);
          assert.equal(recipe.readyIn, result.readyIn);
          assert.equal(recipe.method, result.method);
          assert.equal(recipe.ingredients.length, result.ingredients.length);
          done();
        });
      });
    });

    describe('when requesting resource /recipe/:id with an inexistent id', function() {
      it('should return 404', function(done) {
        request(app)
        .get('/recipes/99a9a825089ca654ca999999')
        .expect('Content-Type', /json/)
        .expect(404, done);
      });
    });
  });

  describe('POST /recipes', function() {
    describe('when creating a new resource /recipes', function() {
      it('should respond with 201', function(done) {
        var recipe = {
            title: "Waffles"
          , description: 'The best waffles!'
          , readyIn: '20 min'
          , method: 'To make the best waffles do this..'
          , ingredients: [
            { name: 'eggs', amount: '2' },
            { name: 'plain flour', amount: '1 1/3 cups' },
            { name: 'sugar', amount: '2tsp' }
            ]
        };

        request(app)
        .post('/recipes')
        .send(recipe)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          var result = JSON.parse(res.text);
          assert.equal(recipe.title, result.title);
          assert.equal(recipe.description, result.description);
          assert.equal(recipe.readyIn, result.readyIn);
          assert.equal(recipe.method, result.method);
          assert.equal(recipe.ingredients.length, result.ingredients.length);
          done();
        });
      });
    });

    describe('when recreating an existing recipe', function() {
      it('should respond with 409', function(done) {
        var recipe = {
          title: "Pancakes"
        , description: 'The best waffles!'
        , readyIn: '20 min'
        , method: 'To make the best waffles do this..'
        , ingredients: [
            { name: 'eggs', amount: '2' },
            { name: 'plain flour', amount: '1 1/3 cups' },
            { name: 'sugar', amount: '2tsp' }
          ]
        };
        request(app)
        .post('/recipes')
        .send(recipe)
        .expect('Content-Type', /json/)
        .expect(409, done);
      });
    });

    describe('when sending an invalid request', function() {
      it('should respond with 400', function(done) {
        var recipe = {
            title: ''
          , description: ''
        };
        request(app)
        .post('/recipes')
        .send(recipe)
        .expect('Content-Type', /json/)
        .expect(400, done);
      });
    });
  });

  describe('PUT /recipes/:id', function() {
    var recipe = {
      title: "Hotdogs"
    };

    describe('when updating an existing resource /recipe/:id', function() {
      it('should respond with 204', function(done) {
        request(app)
        .put('/recipes/' + id)
        .send(recipe)
        .expect(204, done);
      });
    });

    describe('when updating an inexistent resource', function() {
      it('should respond with 404', function(done) {
        request(app)
        .put('/recipes/99a9a825089ca654ca999999')
        .send(recipe)
        .expect(404, done);
      });
    });

    describe('when updating a resource with invalid request', function() {
      it('should respond with 400', function(done) {
        request(app)
        .put('/recipes/.')
        .send(recipe)
        .expect(400, done);
      });
    });
  });

  describe('DELETE /recipes/:id', function() {
    describe('when deleting an existing recipe', function() {
      it('should respond with 204', function(done) {
        request(app)
        .del('/recipes/' + id)
        .expect(204, done);
      });
    });

    describe('when deleting a resource with an invalid request', function() {
      it('should respond with 400', function(done) {
        request(app)
        .del('/recipes/.')
        .expect(400, done);
      });
    });

    describe('when deleting an inexistent resource', function() {
      it('should respond with 404', function(done) {
        request(app)
        .del('/recipes/99a9a825089ca654ca999999')
        .expect('Content-Type', /json/)
        .expect(404, done);
      });
    });
  });
});

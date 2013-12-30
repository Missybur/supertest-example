var RecipeService = require('../recipe'),
    Recipe = new RecipeService();

exports.all = function(req, res) {
  Recipe.all(function(err, recipes) {
    if(err) return res.json(500, 'Internal Server Error');
    if(recipes === null) recipes = {};
    return res.json(200, recipes);
  });
};

exports.get = function(req, res) {
  Recipe.get(req.params.id, function(err, recipe) {
    if(err)  return res.json(500, err);
    if(recipe === null) return res.json(404, 'Not Found');
    return res.json(200, recipe);
  })
};

exports.post = function(req, res) {
  if( ! req.body.title.length ) return res.json(400, 'Bad Request');

  Recipe.post(req.body, function(err, recipe) {
    if(err) return res.json(500, 'Internal Server Error');
    if(recipe === null) return res.json(409, 'Conflict');
    return res.json(201, recipe);
  });
};

exports.put = function(req, res) {
  if( ! req.body.title ) return res.json(400, 'Bad Request');

  Recipe.put(req.params.id, req.body, function(err, recipe) {
    if(err) return res.json(500, 'Internal Server Error');
    if(recipe === null) return res.json(404, 'Not Found');
    return res.json(204, 'No Content');
  });
};

exports.del = function(req, res) {
  Recipe.del(req.params.id, function(err, recipe) {
    if(err) return res.json(500, 'Internal Server Error');
    if(recipe === null) return res.json(404, 'Not Found');
    return res.json(204, 'No Content');
  });
};

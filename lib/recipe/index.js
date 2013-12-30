var mongoose = require('mongoose')
  , RecipeModel = mongoose.model('Recipe');

function Recipe() {};

Recipe.prototype.all = function(callback) {
  RecipeModel.find({}, function(err, recipes) {
    if(err) return(err, null);
    return callback(null, recipes);
  });
};

Recipe.prototype.get = function(id, callback) {
  RecipeModel.findOne({ '_id': id }, function(err, recipe) {
    if(err) return callback(err, null);
    return callback(null, recipe);
  });
};

Recipe.prototype.post = function(data, callback) {
  var recipe = new RecipeModel(data);

  RecipeModel.findOne({ 'title': data.title }, function(err, doc) {
    if(err) return callback(err, null);
    if(doc !== null) return callback(null, null);

    recipe.save(function(err, r) {
      if(err) return callback(err, null);
      return callback(null, r);
    });
  });
};

Recipe.prototype.put = function(id, update, callback) {
  delete update._id;

  RecipeModel.findOne({ '_id': id }, function(err, recipe) {
    if(err) return callback(err, null);
    if(recipe === null) return callback(null, null);

    RecipeModel.update({ '_id': id }, update, function(err, recipe) {
      if(err) return callback(err, null);
      return callback(null, {});
    });
  });
};

Recipe.prototype.del = function(id, callback) {
  RecipeModel.findOne({ '_id': id }, function(err, recipe) {
    if(err) return callback(err, null);
    if(recipe === null) return callback(null, null);

    recipe.remove(function(err) {
      if(err) return callback(err, null);
      return callback(null, {});
    });
  });
};

module.exports = Recipe;

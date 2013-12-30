var express = require('express')
  , models = require('../models')
  , recipe = require('../routes/recipe')
  , http = require('http')
  , db = require('../db')
  , id = require('../middleware/id')
  , app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.param('id', id.validate);
});

app.get('/recipes', recipe.all);
app.get('/recipes/:id', recipe.get);
app.post('/recipes', recipe.post);
app.put('/recipes/:id', recipe.put);
app.del('/recipes/:id', recipe.del);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Server listening on port %d', app.get('port'));
});

module.exports = app;

var express = require('express');
var app = express();
var fortunes = [
  "Победи свои страхи, или они победят тебя.",
  "Рекам нужны истоки.",
  "Не бойся неведомого.",
  "Тебя ждет приятный сюрприз.",
  "Будь проще везде, где только можно.",
];
var tours = [
{ id: 0, name: 'Река Худ', price: 99.99 },
{ id: 1, name: 'Орегон Коуст', price: 149.95 },
];
// Установка механизма представления handlebars
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  res.render('home');
});

app.get('/about', function(req, res) {
  var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  res.render('about', {
    fortune: randomFortune
  });
});

app.get('/headers', function(req, res) {
  res.set('Content-Type', 'text/plain');
  var s = '';
  for (var name in req.headers)
    s += name + ': ' + req.headers[name] + '\n';
  res.send(s);
});

app.get('/api/tours', function(req, res) {
  var toursXml = '<?xml version="1.0"?><tours>' +
    products.map(function(p) {
      return '<tour price="' + p.price +
        '" id="' + p.id + '">' + p.name + '</tour>';
    }).join('') + '</tours>';
  var toursText = tours.map(function(p) {
    return p.id + ': ' + p.name + ' (' + p.price + ')';
  }).join('\n');
  res.format({
    'application/json': function() {
      res.json(tours);
    },
    'application/xml': function() {
      res.type('application/xml');
      res.send(toursXml);
    },
    'text/xml': function() {
      res.type('text/xml');
      res.send(toursXml);
    },
    'text/plain': function() {
      res.type('text/plain');
      res.send(toursXml);
    }
  });
});

// Обобщенный обработчик 404 (промежуточное ПО)
app.use(function(req, res, next) {
  res.status(404);
  res.render('404');
});

// Обработчик ошибки 500 (промежуточное ПО)
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.disable('x-powered-by');app.disable('x-powered-by');

app.listen(app.get('port'), function() {
  console.log('Express запущен на http://localhost:' +
    app.get('port') + '; нажмите Ctrl+C для завершения.');
});

var express = require('express');
var app = express();
var credentials = require('./credentials.js');
var fortunes = [
  "Победи свои страхи, или они победят тебя.",
  "Рекам нужны истоки.",
  "Не бойся неведомого.",
  "Тебя ждет приятный сюрприз.",
  "Будь проще везде, где только можно.",
];
var tours = [{
    id: 0,
    name: 'Река Худ',
    price: 99.99
  },
  {
    id: 1,
    name: 'Орегон Коуст',
    price: 149.95
  },
];
// Установка механизма представления handlebars
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});
// Немного измененная версия официального регулярного выражения
// W3C HTML5 для электронной почты:
// https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
var VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
'[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
'(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
}));

app.use(require('body-parser').urlencoded({
  extended: true
}));

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  // Если имеется экстренное сообщение,
  // переместим его в контекст, а затем удалим
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

app.get('/', function(req, res) {
  req.session.userName = 'Anonymous';
  var colorScheme = req.session.colorScheme || 'dark';
  //console.log(colorScheme);
  res.render('home');
  //res.cookie('monster', 'nomnom');
  /*res.cookie('signed_monster', 'nomnom', {
    signed: true //false
  })*/
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

app.get('/newsletter', function(req, res) {
  // мы изучим CSRF позже... сейчас мы лишь
  // заполняем фиктивное значение
  res.render('newsletter', {
    csrf: 'CSRF token goes here'
  });
});

app.post('/snewsletter', function(req, res) {
  var name = req.body.name || '',
    email = req.body.email || '';
  // Проверка вводимых данных
  if (!email.match(VALID_EMAIL_REGEX)) {
    if (req.xhr)
      return res.json({
        error: 'Некорректный адрес электронной почты.'
      });
    req.session.flash = {
      type: 'danger',
      intro: 'Ошибка проверки!',
      message: 'Введенный вами адрес электронной почты некорректен.',
    };
    console.log('Ошибка проверки!');
    return res.redirect(303, '/newsletter/archive');
  }


    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
  // NewsletterSignup — пример объекта, который вы могли бы
  // создать;поскольку все реализации различаются,
  // оставляю написание этих зависящих от
  // конкретного проекта интерфейсов на вашеИспользование сеансов для реализации экстренных сообщений 137
  // усмотрение. Это просто демонстрация того, как
  // типичная реализация на основе Express может
  // выглядеть в вашем проекте.
  /*new NewsletterSignup({
    name: name,
    email: email
  }).save(function(err) {
    if (err) {
      if (req.xhr) return res.json({
        error: 'Ошибка базы данных.'
      });
      req.session.flash = {
        type: 'danger',
        intro: 'Ошибка базы данных!',
        message: 'Произошла ошибка базы данных. Пожалуйста, попробуйте позднее',
      }
      return res.redirect(303, '/newsletter/archive');
    }
    if (req.xhr) return res.json({
      success: true
    });
    req.session.flash = {
      type: 'success',
      intro: 'Спасибо!',
      message: 'Вы были подписаны на информационный бюллетень.',
    };
    return res.redirect(303, '/newsletter/archive');
  });*/
});

app.post('/process', function(req, res) {
  console.log('Form (from querystring): ' + req.query.form);
  console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  console.log('Name (from visible form field): ' + req.body.name);
  console.log('Email (from visible form field): ' + req.body.email);
   console.log('cookie: ' + req.cookies.monster);
   res.clearCookie('monster');
  res.redirect(303, '/thank-you');
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

app.disable('x-powered-by');
app.disable('x-powered-by');

app.listen(app.get('port'), function() {
  console.log('Express запущен на http://localhost:' +
    app.get('port') + '; нажмите Ctrl+C для завершения.');
});

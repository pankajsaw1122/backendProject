const express = require('express');
const path = require('path');
var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Allow CORS 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//Load routes
const upload = require('./routes/api/upload');
const user = require('./routes/api/user');
const question = require('./routes/api/question');
const answer = require('./routes/api/answer');
const comments = require('./routes/api/comments');

// Database Connection
mongoose.connect('mongodb://localhost/qnadb', {}).then(() => console.log('Mongodb Connected'))
    .catch(err => console.log(err));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Index route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

// test api doc page 
app.get('/test', (req, res) => {
    res.render('test');
});

// use routes
app.post('/uploadImage', upload);
app.post('/adduser', user);
app.post('/userLogin', user);
app.post('/ask', question); 
app.post('/editquestion', question); 
app.post('/deletequestion', question);
app.post('/answer', answer);
app.post('/editanswer', answer);
app.post('/deleteanswer', answer);
app.post('/comment', comments);
app.post('/editcomment', comments);
app.post('/deletecomment', comments);

const port = 5000;
app.listen(port, () => {
    console.log('server started on port: ' + port);
});
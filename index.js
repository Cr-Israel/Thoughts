const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
const mysql2 = require('mysql2');

const conn = require('./db/conn');

//Models
const Thought = require('./models/Thought');
const User = require('./models/User');
//Import Routes
const thoughtsRoutes = require('./routes/thoughtsRoutes');
const authRoutes = require('./routes/authRoutes');

//Import Controller
const ThoughtController = require('./controllers/ThoughtController');

const app = express();

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

//sesion middleware
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    }),
);

//flash messages
app.use(flash());

//public
app.use(express.static('public'));

//configurar a sessão da resposta (set session to res)
app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session;
    };

    next();
});

//Routes
app.use('/thoughts', thoughtsRoutes);
app.use('/', authRoutes);

//Apenas para acessar a rota '/' da minha aplicação, ele vai ter a mesma resposta, se eu acessase o '/thoughts'
app.get('/', ThoughtController.showThoughts);

conn.sync(/*{force: true}*/).then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}!`);
    });
}).catch(err => console.log(err));

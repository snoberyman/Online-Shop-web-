const path = require('path');

const http = require('http');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const errorController = require('./controllers/error');

const express = require('express');
const app = express();

// view engines
// 1- handlebars
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname:'hbs'}));
// app.set('view engine', 'hbs');
// 2- pug
// app.set('view engine', 'pug');
// 3- ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

// determine root directory
const rootDir = require('./util/path');
const mongoConnect = require('./util/database').mongoConnect;

const User = require('./models/user');

// routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

// serving static pages like css, js, ...
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
    User.findById('5f0d1e5df680b2e66259ef9d')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

// routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// 404 page response
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});


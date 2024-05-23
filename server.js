const express = require('express');
const sessions = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(sessions.Store);
const exphbs = require('express-handlebars');
const moment = require('moment');

const sequelize = require('./config/config');
const { homeRoutes, dashboardRoutes, apiRoutes } = require('./controllers');

const app = express();
const PORT = process.env.PORT || 3000;

const hbs = exphbs.create({
    helpers: {
        formatDate: (date) => {
            return moment(date).format('MMMM Do YYYY, h:mm:ss a');
        }
    }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const sess = {
    secret: 'Super secret secret',
    cookie: {},
    store: new SequelizeStore({
        db: sequelize
    }),
    resave: false,
    saveUninitialized: true,
    rolling: true
};

app.use(sessions(sess));

app.use('/', homeRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api', apiRoutes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

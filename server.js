const express = require('express');
const sessions = require('express-session');
const exphbs = require('express-handlebars');
const Sequelize = require('sequelize'); 
const SequelizeStore = require('connect-session-sequelize')(sessions.Store);
const config = require('./config/config');
const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env].database, config[env].username, config[env].password, {
    host: config[env].host,
    dialect: config[env].dialect,
});

const routes = require('./controllers');
const { homeRoutes, dashboardRoutes, apiRoutes } = require('./controllers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.engine('handlebars', exphbs.engine());
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

app.use(routes);

app.use('/', homeRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api', apiRoutes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

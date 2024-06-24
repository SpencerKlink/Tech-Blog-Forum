const express = require('express');
const sessions = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(sessions.Store);
const { sequelize } = require('./models');
const routes = require('./controllers');
const userRoutes = require('./controllers/api/userRoutes');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const hbs = exphbs.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const sess = {
    secret: process.env.SESSION_SECRET || 'Super secret secret',
    cookie: {},
    store: new SequelizeStore({
        db: sequelize
    }),
    resave: false,
    saveUninitialized: true,
    rolling: true
};

app.use(sessions(sess));

app.use('/api/users', userRoutes);
app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

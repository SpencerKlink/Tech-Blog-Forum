const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const userPosts = await Post.findAll({
            where: { userId: req.session.userId },
            include: [
                {
                    model: Comment,
                    include: {
                        model: User
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });
        const posts = userPosts.map(post => post.get({ plain: true }));
        res.render('dashboard', {
            posts,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id);

        if (!postData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }

        const post = postData.get({ plain: true });
        res.render('edit-post', {
            post,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/new', withAuth, (req, res) => {
    res.render('new-post', { loggedIn: req.session.loggedIn });
});

module.exports = router;

const Thought = require('../models/Thought');
const User = require('../models/User');
const { Op } = require('sequelize');

module.exports = class ThoughtController {

    static addThought(req, res) {
        res.render('thoughts/create');
    };

    static async addThoughtSave(req, res) {
        try {
            const thought = {
                title: req.body.title,
                UserId: req.session.userid
            };

            await Thought.create(thought);

            req.flash('message', 'Pensamento criado com sucesso!');
            req.session.save(() => {
                res.redirect('/thoughts/dashboard');
            })
        } catch (err) {
            console.log('Aconteceu um erro: ' + err);
        };
    };
    static async showThoughts(req, res) {
        let search = '';
        if (req.query.search) {
            search = req.query.search;
        };

        let order = 'DESC';

        if (req.query.order === 'old') {
            order = 'ASC';
        } else {
            order = 'DESC';
        };

        const thoughtsData = await Thought.findAll({
            include: User,
            where: {
                title: { [Op.like]: `%${search}%` },
            },
            order: [['createdAt', order]],
        });
        const thoughts = thoughtsData.map((result) => result.get({ plain: true }));

        let thoughtsQty = thoughts.length;
        // O zero(0) para o Handlebars não significa falso, então tenho que fazer uma modificação.
        if (thoughtsQty === 0) {
            thoughtsQty = false;
        };

        res.render('thoughts/home', { thoughts, search, thoughtsQty });
    };

    static async dashboard(req, res) {
        const userId = req.session.userid;

        const user = await User.findOne({
            where: {
                id: userId
            },
            include: Thought,
            plain: true
        });

        if (!user) {
            res.redirect('/login');
            return;
        };

        const thoughts = user.Thoughts.map((result) => result.dataValues);

        let emptyThoughts = false;

        if (thoughts.lenght === 0) {
            emptyThoughts = true;
            return;
        };

        res.render('thoughts/dashboard', { thoughts, emptyThoughts });
    };

    static async updateThought(req, res) {
        const { id } = req.params;

        const thought = await Thought.findOne({ where: { id: id }, raw: true });
        res.render('thoughts/edit', { thought });
    };

    static async updateThoughtSave(req, res) {
        const { id } = req.body;
        const { userid } = req.session;

        const thought = {
            title: req.body.title
        };

        try {
            await Thought.update(thought, { where: { id: id, userid: userid } });

            req.flash('message', 'Pensamento atualizado com sucesso!');
            req.session.save(() => {
                res.redirect('/thoughts/dashboard');
            })
        } catch (err) {
            console.log('Aconteceu um erro: ' + err);
        };
    };

    static async removeThought(req, res) {
        const { id } = req.body;
        const { userid } = req.session;

        try {
            await Thought.destroy({ where: { id: id, userid: userid } });

            req.flash('message', 'Pensamento removido com sucesso!');
            req.session.save(() => {
                res.redirect('/thoughts/dashboard');
            })
        } catch (err) {
            console.log('Aconteceu um erro: ' + err);
        };
    };
};
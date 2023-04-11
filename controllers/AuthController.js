const User = require('../models/User');

const bcrypt = require('bcryptjs');

module.exports = class AuthController {
    static async register(req, res) {
        res.render('auth/register');
    };

    static async registerPost(req, res) {

        const { name, email, password, confirmpassword } = req.body;

        if (password != confirmpassword) {
            req.flash('message', 'As senhas não conferem');
            res.render('auth/register');
            return;
        };

        const checkIfUserExists = await User.findOne({ where: { email } });

        if (checkIfUserExists) {
            req.flash('message', 'E-mail já está em uso');
            res.render('auth/register');
            return;
        };

        const salt = bcrypt.genSaltSync(10);

        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = {
            name,
            email,
            password: hashedPassword
        };

        try {
            const createdUser = await User.create(user);

            req.flash('message', 'Cadastro realizado com sucesso!');
            req.session.userid = createdUser.id;
            req.session.save(() => {
                res.redirect('/');
            })
        } catch (error) {
            consolee.log(err);
        };
    };

    static async login(req, res) {
        res.render('auth/login');
    };

    static async loginPost(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            req.flash('message', 'Usuário não encontrado');
            res.render('auth/login');
            return;
        };

        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (!passwordMatch) {
            req.flash('message', 'Senha inválida');
            res.render('auth/login');
            return;
        };

        req.session.userid = user.id;
        req.flash('message', 'Autenticação realizada com sucesso!');
        req.session.save(() => {
            res.redirect('/');
        });
    };

    static logout(req, res) {
        req.session.destroy(function(err) {
            if(err) {
                console.log(err);
                return;
            };

            res.clearCookie('session'); //Remove o cookie da sessão
            res.redirect('/login');
        });
    };
};

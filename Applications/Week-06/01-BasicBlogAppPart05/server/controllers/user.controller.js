const User = require('../models/user.model');
const UserDb = require('../db/user.db');
const Common = require('./common');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 15;

const LOGIN_FAIL = 'Email or Password was incorrect.';

class UserController {
    constructor(router) {
        router.route('/user/search')
            .post(this.search);
        router.route('/user/:id')
            .get(this.getOne)
            .put(this.updateOne)
            .delete(this.deleteOne);
        router.route('/user')
            .get(this.getAll)
            .post(this.insertOne);
        router.route('/user/login')
            .post(this.login);
        router.route('/user/register')
            .post(this.register);
    }

    async login(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const data = await UserDb.getByEmail(email);
            if (data) {
                const result = await bcrypt.compare(password, data.password);
                if (result) {
                    const user = new User(data);
                    console.log(process.env.JWT_SECRET)
                    const token = jwt.sign({ id: user.id, username: user.username },
                        process.env.JWT_SECRET, { expiresIn: '1h' }
                    );
                    return Common.resultOk(res, { token: token, user: user });
                } else {
                    return Common.resultNotFound(res, LOGIN_FAIL);
                }
            } else {
                // in debug mode we could say user doesn't exist here
                // calculate hash to create a delay (don't leak fact that user doesn't exist)
                const hash = await bcrypt.hash(password, SALT_ROUNDS);
                return Common.resultNotFound(res, LOGIN_FAIL);
            }
        } catch (e) {
            // handle error
            return Common.resultErr(res, e.message);
        }
    }

    async register(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const username = req.body.username;
            // check if username is available
            const data = await UserDb.getByEmail(email);
            if (data) {
                // user already exists
                // calculate hash anyway to create a delay (discourage email snooping)
                const hash = await bcrypt.hash(password, SALT_ROUNDS);
                return Common.userAlreadyExists(res);
            } else {
                // calculate hash
                const hash = await bcrypt.hash(password, SALT_ROUNDS);
                // Store user account with hash
                const user = await UserDb.register(username, email, hash);
                if (user) {
                    Common.resultOk(res, new User(user));
                } else {
                    Common.resultErr(res);
                }
            }
        } catch (e) {
            // handle error
            return Common.resultErr(res, e.message);
        }
    }

    async getOne(req, res, next) {
        try {
            const data = await UserDb.getOne(req.params.id);
            if (data) {
                const user = new User(data);
                return Common.resultOk(res, user);
            } else {
                return Common.resultNotFound(res);
            }
        } catch (e) {
            // handle error
            return Common.resultErr(res, e.message);
        }
    }

    async updateOne(req, res, next) {
        try {
            const data = await UserDb.updateOne(req.params.id, req.body);
            if (data) {
                const user = new User(data);
                return Common.resultOk(res, user);
            } else {
                return Common.resultNotFound(res);
            }
        } catch (e) {
            // handle error
            return Common.resultErr(res, e.message);
        }
    }

    async insertOne(req, res, next) {
        try {
            const data = await UserDb.insertOne(req.body);
            if (data) {
                const user = new User(data);
                return Common.resultOk(res, user);
            } else {
                return Common.resultNotFound(res);
            }
        } catch (e) {
            // handle error
            return Common.resultErr(res, e.message);
        }
    }

    async deleteOne(req, res, next) {
        try {
            const data = await UserDb.deleteOne(req.params.id);
            if (data) {
                return Common.resultOk(res, data);
            } else {
                return Common.resultNotFound(res);
            }
        } catch (e) {
            // handle error
            return Common.resultErr(res, e.message);
        }
    }

    async getAll(req, res, next) {
        try {
            const data = await UserDb.getAll();
            if (data) {
                const users = data.map(p => { return new User(p) });
                return Common.resultOk(res, users);
            } else {
                return Common.resultNotFound(res);
            }
        } catch (e) {
            return Common.resultErr(res, e.message);
        }
    }

    async search(req, res, next) {
        try {
            const data = await UserDb.search(req.body.search);
            if (data) {
                const users = data.map(p => { return new User(p) });
                return Common.resultOk(res, users);
            } else {
                return Common.resultOk([]);
            }
        } catch (e) {
            console.log('catch', e)
            return Common.resultErr(res, e.message);
        }
    }
}

module.exports = UserController;
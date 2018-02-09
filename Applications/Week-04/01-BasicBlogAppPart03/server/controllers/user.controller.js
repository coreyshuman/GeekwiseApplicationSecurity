const User = require('../models/user.model');
const UserDb = require('../db/user.db');
const Common = require('./common');
const bcrypt = require('bcrypt');

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
            let email = req.body.email;
            let password = req.body.password;
            const data = await UserDb.getByEmail(email);
            if (data) {
                let result = await bcrypt.compare(password, data.password);
                if (result) {
                    let user = new User(data);
                    return Common.resultOk(res, user);
                } else {
                    return Common.resultNotFound(res, LOGIN_FAIL);
                }
            } else {
                // in debug mode we could say user doesn't exist here
                return Common.resultNotFound(res, LOGIN_FAIL);
            }
        } catch (e) {
            // handle error
            if (e.code == 0) {
                return Common.resultNotFound(res);
            } else {
                return Common.resultErr(res, e.message);
            }
        }
    }

    async register(req, res, next) {
        try {
            let email = req.body.email;
            let password = req.body.password;
            let username = req.body.username;
            // check if username is available
            const data = await UserDb.getByEmail(email);
            if (data) {
                // user already exists
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
            if (e.code == 0) {
                return Common.resultNotFound(res);
            } else {
                return Common.resultErr(res, e.message);
            }
        }
    }

    async getOne(req, res, next) {
        try {
            const data = await UserDb.getOne(req.params.id);
            if (data) {
                let user = new User(data);
                return Common.resultOk(res, user);
            } else {
                return Common.resultNotFound(res);
            }
        } catch (e) {
            // handle error
            if (e.code == 0) {
                return Common.resultNotFound(res);
            } else {
                return Common.resultErr(res, e.message);
            }
        }
    }

    async updateOne(req, res, next) {
        try {
            const data = await UserDb.updateOne(req.params.id, req.body);
            if (data) {
                let user = new User(data);
                return Common.resultOk(res, user);
            } else {
                return Common.resultNotFound(res);
            }
        } catch (e) {
            // handle error
            if (e.code == 0) {
                return Common.resultNotFound(res);
            } else {
                return Common.resultErr(res, e.message);
            }
        }
    }

    async insertOne(req, res, next) {
        try {
            const data = await UserDb.insertOne(req.body);
            if (data) {
                let user = new User(data);
                return Common.resultOk(res, user);
            } else {
                return Common.resultNotFound(res);
            }
        } catch (e) {
            // handle error
            if (e.code && e.code === 0) {
                return Common.resultNotFound(res);
            } else {
                return Common.resultErr(res, e.message);
            }
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
            if (e.code && e.code === 0) {
                return Common.resultNotFound(res);
            } else {
                return Common.resultErr(res, e.message);
            }
        }
    }

    async getAll(req, res, next) {
        try {
            const data = await UserDb.getAll();
            if (data) {
                let users = data.map(p => { return new User(p) });
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
                let users = data.map(p => { return new User(p) });
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
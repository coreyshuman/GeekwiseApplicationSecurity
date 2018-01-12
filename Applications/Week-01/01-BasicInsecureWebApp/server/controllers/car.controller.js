const Car = require('../models/car.model');
const CarDb = require('../db/car.db');
const Common = require('./common');

class CarController {
    constructor(router) {
        router.route('/car/:id')
            .get(this.getSingle);
    }

    async getSingle(req, res, next) {
        try {
            const data = await CarDb.getOne(req.params.id);
            if (data) {
                let car = new Car(data);
                return Common.resultOk(res, car.toString());
            } else {
                return Common.resultNotFound(res);
            }
        } catch (e) {
            // handle error
            if (e.code == 0) {
                return Common.resultNotFound(res);
            } else {
                return Common.resultErr(res, e);
            }
        }
    }
}

module.exports = CarController;
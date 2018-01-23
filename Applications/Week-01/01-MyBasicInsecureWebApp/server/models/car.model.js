class Car {
    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    toString() {
        return `Make: ${this.make}, Model: ${this.model}, Car_Year: ${this.car_year}`;
    }
}

module.exports = Car;
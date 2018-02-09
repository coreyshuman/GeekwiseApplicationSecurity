class Car {
    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    toString() {
        return `Make: ${this.make}, Model: ${this.model}`;
    }
}

module.exports = Car;
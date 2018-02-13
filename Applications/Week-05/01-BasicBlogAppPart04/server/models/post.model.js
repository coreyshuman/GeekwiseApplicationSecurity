class Post {
    constructor(obj) {
        obj && Object.assign(this, obj);
    }

    toString() {
        return ``;
    }
}

module.exports = Post;
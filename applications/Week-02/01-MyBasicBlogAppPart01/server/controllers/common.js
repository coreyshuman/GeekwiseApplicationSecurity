class Common {
    static resultOk(res, obj) {
        res.json({ data: obj });
    }
    static resultErr(res, obj) {
        res.status(500).json({ error: obj });
    }
    static resultNotFound(res) {
        res.status(404).json({ message: 'Not Found' });
    }
}

module.exports = Common;
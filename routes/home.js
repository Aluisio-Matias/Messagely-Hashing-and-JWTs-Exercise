const Router = require("express").Router;

const router = new Router();

router.get("/", async (req, res, next) => {
    try {
        return res.render("index.html");
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
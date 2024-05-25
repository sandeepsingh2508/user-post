const { signUp, logIn } = require("../controllers/auth");
const { createValidate } = require("../validators/auth");

const router = require("express").Router();
router.post("/signup",createValidate, signUp);
router.post("/login", logIn);
module.exports = router;

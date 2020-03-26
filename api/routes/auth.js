const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');

// Register
router.post('/register', async (req, res) => {
    // Lets Validate The Data Before We a User
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
     try {
        const savedUser = await user.save();
        res.status(200).send(savedUser);
     } catch(err) {
        res.status(400).send(err);
     }
});

// Login
router.post('/login', async (req, res) => {
    // Lets Validate The Data Before We a User
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Checking if the user is already in the database
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is not found!');

    // Checking if Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password!');

    // Create and asign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token)

    // res.status(200).send('Logged in!');
});

module.exports = router;
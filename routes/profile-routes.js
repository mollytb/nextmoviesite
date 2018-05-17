const router = require('express').Router();
var path = require("path");

const authCheck = (req, res, next) => {
    if(!req.user){
        // If user is not logged in
        res.redirect('/auth/login');
    } else {
        // If logged in
        next();
    }
};

router.get('/', authCheck, (req,res) => {
	console.log('profile');
    res.sendFile(path.join(__dirname, "../public/profile.html"));
});

module.exports = router;
module.exports.isLoggedIn = (req,res,next) => {
    // console.log("REQ.USER....", req.user)       //fill in deserialized information into data
    if(!req.isAuthenticated()){     //isAuthenticated is used to check whether the user is authenticated it uses req.isAuthenticated
        //store the url they are requesting using console.log(req.path, req.originalUrl)
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!')
        return res.redirect('/login')
    }
    next();
}
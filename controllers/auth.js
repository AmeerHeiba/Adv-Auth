const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  //extract user details from user
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)  // compare passwords
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));

 
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  User.findOne({ email: email })
  .then(userDoc => {
    if (userDoc) {
      return res.redirect('/login');
    }
    return bcrypt
    .hash(req.body.password, 12)
    .then(hashedPassword => {
      const userName = email.split('@')[0];
      const user = new User({
        email: email,
        password: hashedPassword,
        name: userName
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
    })  
  })
  .catch(err => console.log(err));

  
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../models");
// const config = require("../config/database");
const bcrypt = require("bcryptjs");

module.exports = function(passport) {
  // Local Strategy
  passport.use(
    new LocalStrategy(function(username, password, done) {
      // Match username
      //   username = req.body.username;
      //   password = req.body.password;
      User.findOne({
        where: {
          username: username
        }
      }).then(user => {
        bcrypt.compare(password, user.password, function(err, isMatch) {
          console.log(`isMatch is: ${isMatch}`);
          if (err) throw err;
          if (isMatch) {
            console.log("inside isMatch runs");
            return done(null, user);
          } else {
            return done(null, false, { message: "Wrong Password" });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    console.log(`serialize ran and this is the user ${user.username}`);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log(`inside deserialize runs ${id}`);
    User.findById(id).then((user, err) => {
      console.log(`inside deserialize find and user ${user.username}`);
      done(err, user);
    });
  });
};

// start old code
//   let query = { username: username };
//   User.findOne(query, function(err, user) {
//     if (err) throw err;
//     if (!user) {
//       return done(null, false, { message: "No User Found" });
//     }

//     // Match password
//     bcrypt.compare(password, user.password, function(err, isMatch) {
//       if (err) throw err;
//       if (isMatch) {
//         return done(null, user);
//       } else {
//         return done(null, false, { message: "Wrong Password" });
//       }
//     });
//   });
// End old code

// Safe almost working
// passport.use(
//     new LocalStrategy(function(username, password, done) {
//       User.findOne({
//         where: {
//           username: username
//         }
//       }).then(user => {
//         bcrypt.compare(password, user.password, function(err, isMatch) {
//           if (err) throw err;
//           if (isMatch) {
//             return done(null, user);
//           } else {
//             return done(null, false, { message: "Wrong Password" });
//           }
//         });
//       });
//     })
//   );

// passport.serializeUser(function(user, done) {
//     console.log(`serializew ran and this is the user ${user.id}`);
//     done(null, user.id);
//   });

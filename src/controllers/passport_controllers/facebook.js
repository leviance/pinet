const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
const user_model = require('../../models/users.model')

let init_passport_facebook = () => {

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://localhost:3001/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email', 'gender'],
    enableProof: true
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await user_model.find_by_facebook_id(profile._json.id)

        if(user) return done(null, user)

        // if user not found create a new one
        let data = {
          username: profile._json.name,
          local: {is_active : true},
          facebook: {
            id: profile._json.id,
            token: accessToken,
            email: profile._json.email
          }
        }

        new_user = await user_model.create_with_app(data)

        return done(null,new_user)

      } catch (error) {
        console.log(error)
        return done(null, false)
      }
    }
  ));

  // save user id to session
  passport.serializeUser((user,done) =>{
    done(null,user);
  });


  passport.deserializeUser( async (user, done) =>{
    return done(null, user);
  });

}

module.exports = init_passport_facebook

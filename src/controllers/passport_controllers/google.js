const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const user_model = require('../../models/users.model')
const download_img = require('../../config/download_img')

let init_passport_google = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: process.env.GOOGLE_APP_CALLBACK
  },
    async (accessToken, refreshToken, profile, done) => {
      
      try {
        let user = await user_model.find_by_google_id(profile._json.sub)

        // if found user
        if(user) return done(null, user)

        // download avatar user
        let url_user_avatar = profile._json.picture;
        let avatar_name = ""
        
        try {
          avatar_name = await download_img(url_user_avatar)
        } catch (error) {
          console.log(`has error in download img from login with facebook: ${error}`)
          avatar_name = "avatar-defult.jpg"
        }

        // if user not found create a new one
        let data = {
          username: profile._json.name,
          local: {is_active : true},
          avatar: avatar_name,
          google: {
            id: profile._json.sub,
            token: accessToken,
            email: profile._json.email
          }
        }

        new_user = await user_model.create_with_app(data)

        return done(null,new_user)

      } catch (error) {
        console.log(`error login with google: ${error}`)
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

module.exports = init_passport_google
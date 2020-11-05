const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
const user_model = require('../../models/users.model')
const download_img = require('../../helper/download_img')

let init_passport_facebook = () => {

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_APP_CALLBACK,
    profileFields: ['id', 'displayName', 'email', 'gender', 'picture.type(large)'],
    enableProof: true
  },
    async (accessToken, refreshToken, profile, done) => {
      
      try {
        let user = await user_model.find_by_facebook_id(profile._json.id)

        if(user) return done(null, user)

        // download avatar user
        let url_user_avatar = profile._json.picture.data.url;
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
          avatar: avatar_name,
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
        console.log(`error login with facebook: ${error}`)
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


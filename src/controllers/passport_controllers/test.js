let initPassportFacebook = () => { passport
  passport.use(new FacebookStrategy({
    clientID: fbAppId, 
    clientSecret : fbAppSecret,
    callbackURL : fbAppCallbackUrl,
    passReqToCallback: true,
    profileFields: ["email", "gender","displayName"]
  },async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findByFacebookUid(profile.id);
      if(user) { 
        return done(null,user, req.flash('success',transSuccess.loginSuccess(user.username)));
      }
      // console.log(profile);
      let newUserItem = {
        username: profile.displayName,
        gender: profile.gender,
        local : {isActive : true},
        facebook : {
          uid : profile.id,
          token : accessToken,
          email : profile.emails[0].value
        }
      };

      let newUser = await UserModel.createNew(newUserItem);
      return done(null,newUser, req.flash('success',transSuccess.loginSuccess(newUser.username)));
    } catch (error) {
      console.log(error);
      return done(null,false,req.flash('errors', transError.server_error));
    }
  }));

  // save user id to session
  passport.serializeUser((user,done) =>{
    done(null,user._id);
  });

  passport.deserializeUser( async(id, done) =>{
    try {
      let user = await UserModel.findUserByIdForSessionToUse(id);
      let getChatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);

      //let user = user.toObject();
      user.chatGroupIds = getChatGroupIds;
      return done(null,user);
    } catch (error) {
      return done(error,null);
    }
  });
  
}

module.exports = initPassportFacebook;
module.exports = function(passport ,FacebookStrategy ,config,mongoose){

	var chatUser=new mongoose.Schema({
		profileID:String,
		fullname:String,
		profilePic:String
	})

	var userModel1= mongoose.model('chatUser',chatUser);

	passport.serializeUser(function(user,done ){
		done(null,user.id);//mongo lab assign id

	});

	passport.deserializeUser(function(id,done){
		userModel1.findById(id,function(err,user){
			done(err,user);
		})
	})


	passport.use(new FacebookStrategy ({
		clientID:config.fb.appID,
	 	clientSerect:config.fb.appSerect,
	 	callbackURL:config.fb.callbackURL,
	 	profileFields:['id','displayName','photos']
	 },function(accessToken,refereshToken,profile,done){
	 	userModel1.findOne({'profileID':profile.id},function(err,result){
	 		if(result){
	 			done(null,result)
	 		}
	 		else
	 		{
	 			// create a new user in mongolab account
	 			var newChatUser = new userModel1({
	 				profileID:profile.id,
	 				fullname:profile.displayName,
	 				profilePic:profile.photos[0].value || ''
	 			});
	 		newChatUser.save(function(err){
	 			done(null,newChatUser);
	 		})
	 		}
	 	})

	 }))
	
}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");



const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    //username, password hashing, salting and also some methods will be handle automatically by passport-local-mongoose
})

userSchema.plugin(passportLocalMongoose);


module.exports=mongoose.model('User', userSchema);
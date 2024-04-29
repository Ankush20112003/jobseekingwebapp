import mongoose from "mongoose";
import validator from "validator";
import bcrypt from  "bcrypt";
import jwt from  'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Please provide your name"],
        minLenght: [3,'Name should be more than 2 characters'],
        maxLenght: [30,'Name should be less than 30 characters'],
    },
    email:{
        type: String,
        required: [true,"Please provide your email address"],
        validator: [validator.isEmail, 'Please provide a valid Email Address'],
    },
    phone:{
        type:Number,
        required: [true,"Phone number is required"],
    },
    password:{
        type: String,
        required: [true,"Please provide a password"],
        minLength: [8,'Password should  have at least 8 characters'],
        maxLenght: [15,'Password should not exceed 15 characters'],
        select: false
    },
    role:{
        type:String,
        required:['You must specify a role for the user'],
        enum: ['admin','user','Job Seeker', 'Employer'],
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
})
// Method to hash passwords before saving them into database
userSchema.pre("save" , async function(next){
   if(!this.isModified("password")) return next();
   try{
       this.password = await bcrypt.hash(this.password, 10);
       next()
   }
   catch(err) {
       console.log(err);
   }
});

// Static method to compare and validate password
userSchema.methods.comparePassword = async function (enteredPassword)  {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.geJWTToken = function(){
    return jwt.sign({ id: this._id},process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export const  User= mongoose.model('User' , userSchema );
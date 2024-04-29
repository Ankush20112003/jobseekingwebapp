import mongoose from "mongoose";

const jobSchema = new  mongoose.Schema({
    title: { 
        type: String, 
        required: [true,"Please provide job title"],
        minLength:  [3,'Title must be at least 3 characters'],
        maxLength: [100,'Title cannot exceed 100 characters']
        },
    description: {
        type: String,
        required: [true, 'Job description is required.'],
        minLength: [3, 'Description must be at least 3 characters'],
        maxLength: [350, 'Description cannot exceed 350 characters']
    },
    category: {
        type: String,
        required: [true,"job category is required" ],
    },
    country: {
        type: String,
        required: [true,"job country is required" ],
    },
    city: {
        type: String,
        required: [true,"job city is required" ],
    },
    location: {
        type: String,
        required: [true,"Please provide the exact location" ],
        minLength: [50,"Location should have minimum of 50 characters"],
    },
    fixedSalary: {
        type: Number,
        minLength: [4,"fixed salary must contain atleast 4  digits"],
        maxLength: [9,"fixed salary cannot exceed  9 digits"],
    },
    salaryFrom: {
        type: Number,
        minLength: [4, "salary from must contain atleast  4 digits"],
        maxLength: [9 , "salary from must not exceed  9 digits"]
    },
    salaryTo: {
        type: Number,
        minLength: [4 , "salaryTo from  must contain atleast 4 digits"],
        maxLength: [9, "salaryTo cannot exceed  9 digits"]
    },
    expired: {
        type: Boolean,
        default: false,
    },
    jobPostedOn: {
        type: Date,
        default:  Date.now,
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
});

export const Job = mongoose.model ("Job", jobSchema);  

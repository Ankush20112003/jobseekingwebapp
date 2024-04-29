import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";

export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs
  });
});

export const postJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler(
        "Job Seeker is not allowed to access these resources!",
        400
      )
    );
  }
  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo
  } = req.body;

  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler("Please provide full job description", 400));
  }
  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new ErrorHandler(
        "Please either provide fixed salary and the ranged salary! "
      )
    );
  }
  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new ErrorHandler(
        "Cannot enter the fixed Salary and the ranged Salary Together"
      )
    );
  }

  const postedBy = req.user._id;
  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });

  res.status(200).json({
    success:true,
    message: "Job Posted  Successfully",
    job,
  });
});


export const getmyJobs = catchAsyncError(async(req,res,next)=>{
  const {role} = req.user;
  if(role === "job seeker"){
    return next (
      new ErrorHandler(
        "Job seeker is not allowed to access this resources",
        400
      )
    );
  }
  const myjobs = await Job.find({postedBy:req.user._id});
  res.status(200).json({
    success: true,
    myjobs,
  });
});

export const updateJob = catchAsyncError(async(req,res,next) => {
  const { role } = req.user;
  if(role === "Job Seeker") {
    return next(
      new ErrorHandler(
        "Job Seeker is not allowed to accesss these resources",
        400
      )
    );
  }
  const {id} =  req.params;

  let job = await  Job.findById(id);
  if(!job){
    return next(new ErrorHandler("No Job found with the given Id","404"));
  }
   //make sure user is the owner of the job
  if(job.postedBy.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("You are not authorized to perform this action","401"))
  }
  job = await Job.findByIdAndUpdate(id,req.body,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
  });
  res.status(200).json({
    success : true,
    job,
    message: "Job updated successfully",
  });
});


export const deleteJob = catchAsyncError(async(req,res,next) =>{
  const {role} = req.user;
  if( role === "Job Seeker" ){
    return next ( new ErrorHandler ("Access denied! You do not have permission to delete a job.",403));
  }
  const { id } = req.params;
  let job =await Job.findById(id);
  if  (!job) {
    return next(new ErrorHandler('The specified job could not be found',404))
  }

  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "delete job successfully!",
  });
});

export const getSingleJob = catchAsyncError (async (req,res,next)=>{
  const {id} = req.params;
  try {
    const job  = await Job.findById(id);
    if(!job){
      return next(new ErrorHandler ("Job not found,",404));
    }
    res.status(200).json({
      success:true,
      job,
    });
  } catch (error) {
    return next (new ErrorHandler("Invalid ID/CastError",400));
  }
});
import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, { 
        dbName: "MERN_STACK_JOB_SEEKING" ,
    })
    .then(() => {
      console.log("DB Connected");
    })
    .catch((err) => {
      console.log(`Some error occured while connected to the database : ${err}`);
    });
};

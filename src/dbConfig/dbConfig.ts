import { error } from "console";
import mongoose from "mongoose";

export async function connect(){
    
    try {
        mongoose.connect(process.env.MONGO_URI! )
        const connection=mongoose.connection
        
        connection.on('connected',()=>{
            console.log("MongoDB connected")
        });

        connection.on('error',()=>{
            console.log("MongoDB connection error, please make sure db is up and running:"+error)
        })
    } catch (error) {
        console.log("Something went wrong in connecting to DB");        
        console.log(error)
    }

}
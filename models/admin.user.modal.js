import db from "../db/db.js";

export const signupModel= async(firstName,lastName,email,password,profile_pic,phone)=>{
    try {
        const [result]= await db.query("Insert into users (first_name,last_name,email,password,profile_pic,phone) values(?,?,?,?,?,?)",[firstName,lastName,email,password,profile_pic,phone])
        return result;
    } catch (error) {
        throw new Error(`Error in Signup ${error.message}`)
    }
}
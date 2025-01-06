import mongooes from "mongoose"
import {DB_NAME} from './../constants.js';

export const connectDB = async ()=>{
 try{
    const connectionInstance =await mongooes.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log(`DB connected successfuly ${(connectionInstance.connection.host)}`);
    // console.log("conec obj",connectionInstance);
 }catch(err){
    console.log(`DB connrctio failed  Err: ${err}`);
    process.exit(1);
 }

}

import dotenv from "dotenv";
import { app } from "./app.js";
import {connectDB} from "./db/db.connect.js"

dotenv.config({
    path: './.env'
})

connectDB().then(()=>{
    let PORT= process.env.PORT||8000;
    app.listen(PORT,()=>{
        console.log(`Server listening at ${PORT}`);
    })
}
).catch((err)=>{
console.log(`DB not connected (index.js) errr: ${err}`);

});

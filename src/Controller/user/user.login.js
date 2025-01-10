import {asyncHandler,ApiErr,ApiRes} from "../../utils/untils.expoter.js"
import {USER} from "../../models/user.models.js"

 const tokensGenrater = async(userObj)=>{
   const ACCESS_TOKEN =  await userObj.genrateACCESS_TOKEN();
   const REFRESH_TOKEN = await userObj.genrateREFRESH_TOKEN();
   
   userObj.refreshToken=REFRESH_TOKEN;
  await userObj.save({ validateBeforeSave: false });
  
   return {
    ACCESS_TOKEN,REFRESH_TOKEN
   }
 }    

    const login = asyncHandler(async (req,res)=>{
    const { userName, email, password } = req.body;
    
    if((!(userName||email))){
      throw new ApiErr(400,"require username or email")
    }
    const user = await USER.findOne({
        $or: [{ userName }, { email }]
      });

      
    if(!user){
      throw new ApiErr(404,"user not found")
    }
    
    const isPasswordCorrect =  user.isPasswordCorrect(password);
    
    if(!isPasswordCorrect){
      throw new ApiErr(403,"invail username or password");
    }
   const { ACCESS_TOKEN,REFRESH_TOKEN} = await tokensGenrater(user);

    const Option ={
        httpOnly:true,
        secure:true,
    }
 const {password:password1,refreshToken,...result}= user._doc

   res.status(201).cookie("ACCESS_TOKEN",ACCESS_TOKEN,Option).
   cookie("REFRESH_TOKEN",REFRESH_TOKEN,Option).json(
    new ApiRes(201,"loged in successfully",result)
   )
    
    } )
    export{ login }
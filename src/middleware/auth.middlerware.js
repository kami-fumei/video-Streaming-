import jwt from 'jsonwebtoken';
import { ApiErr } from '../utils/untils.expoter.js';
import {USER} from '../models/user.models.js'

export const AuthVerify = async (req, res, next) => {
    try {
        const ACCESS_TOKEN = req.cookies?.ACCESS_TOKEN ||  req.header("Authorization")?.replace("Bearer ", "");

        if (!ACCESS_TOKEN) {
            throw new ApiErr(400, "Access token required");
        }

        const decodedInfo = jwt.verify(ACCESS_TOKEN, process.env.ACCESS_TOKEN_SECRET);

        const user = await USER.findById(decodedInfo._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiErr(401, "Unauthorized request");
        }

        req.user = user;
        next();
    } catch (error) {
         next(error);
}
}  

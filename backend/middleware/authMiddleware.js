import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import { errorResponse } from "../utils/apiResponse.js";

const protect = async(req,res,next) => {
    
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token) {
        return errorResponse(res,401,"Not authorized, token missing");
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if(!admin) {
        return errorResponse(res,401,"Not authorized, admin not found");
    }

    req.admin = admin;
    next();
}

export default protect;
import Admin from "../models/admin.model.js";
import {successResponse, errorResponse} from "../utils/apiResponse.js";
import {generateToken} from "../utils/genarateToken.js";


//Admin Login 
// @route -> POST /api/auth/login

export const loginAdmin = async(req,res,next) => {
    try {
        const {email,password} = req.body;
        console.log("Login request received:", { email, password }); // Debug

        if(!email || !password){
            return errorResponse(res,400,"Email and password are required");
        }

        const admin = await Admin.findOne({email}).select("+password");

        if(!admin){
            return errorResponse(res,404,"Admin not found");
        }

        //check pass
        const isMatch = await admin.comparePassword(password);

        if(!isMatch){
            return errorResponse(res,400,"Invalid credentials");
        }

        generateToken(res,admin._id);
        return successResponse(res,200,"Admin logged in successfully",{
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            }
        });
    } catch (error) {
        next(error);
    }
}


//Admin Logout
// @route -> POST /api/auth/logout

export const logoutAdmin = async(req,res,next) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return successResponse(res,200,"Admin logged out successfully");
    } catch (error) {
        next(error);
    }
}


//get me admin
// @route -> GET /api/auth/me
// used by frontend on page refresh to check if still logged in

export const getMe = async(req,res,next) => {
    try {
        const id = req.admin._id;
        const admin = await Admin.findById(id)

        if(!admin){
            return errorResponse(res,404,"Admin not found")
        }

        return successResponse(res,200,"Admin found",{
            admin
        });
    } catch (error) {
        next(error);
    }
}



//change password
// @route -> POST /api/auth/change-password

export const changePassword = async(req,res,next) => {
    try {
        const {currentPassword,newPassword} = req.body;

        if(!currentPassword || !newPassword){
            return errorResponse(res,400,"Current password and new password are required");
        }

        if (newPassword.length < 6) {
          return errorResponse(
            res,
            400,
            "New password must be at least 6 characters",
          );
        }

        const admin = await Admin.findById(req.admin._id).select("+password");

        if(!admin){
            return errorResponse(res,404,"Admin not found");
        }

        const isMatch = await admin.comparePassword(currentPassword);

        if(!isMatch){
            return errorResponse(res,400,"Current password is incorrect");
        }
        admin.password = newPassword;

        await admin.save();

        return successResponse(res,200,"Password changed successfully");
    } catch (error) {
        next(error);
    }
}




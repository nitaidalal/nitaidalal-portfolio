import multer from "multer";
import { cloudinary } from "../config/cloudinary.js";
import {CloudinaryStorage} from "multer-storage-cloudinary"

const createStorage = (folder,formats) => {
    return new CloudinaryStorage({
        cloudinary,
        params: {
            folder,
            allowed_formats: formats,
        },
        public_id:(req,file) => {
            const timestamp = Date.now();
            const originalName = file.originalname.split(".")[0];
            return `${folder}-${originalName}_${timestamp}`;
        }
    })
}

const imageFilter = (req,file,cb) => {
    if(file.mimetype.startsWith("image/")) {
        cb(null,true);
    } else {
        cb(new Error("Only image files are allowed!"),false);
    }
}

const pdfFilter = (req,file,cb) => {
    if(file.mimetype === "application/pdf") {
        cb(null,true);
    } else {
        cb(new Error("Only PDF files are allowed!"),false);
    }
}

export const uploadAvatar = multer({
    storage: createStorage("avatars",["jpg","jpeg","png"]),
    fileFilter: imageFilter,
    limits: {fileSize: 2 * 1024 * 1024}
}).single("avatar");


export const uploadResume = multer({
    storage: createStorage("resumes",["pdf"]),
    fileFilter:pdfFilter,
    limits:{fileSize: 5 * 1024 * 1024}
}).single("resume");

export const uploadProjectImage = multer({
    storage:createStorage("project_images",["jpg","jpeg","png"]),
    fileFilter:imageFilter,
    limits:{fileSize: 3 * 1024 * 1024}
}).single("project_image");

export const uploadCertImage = multer({
    storage:createStorage("certificate_image",["jpg","jpeg","png"]),
    fileFilter:imageFilter,
    limits:{fileSize: 2 * 1024 * 1024}
}).single("certificate_image");

export const uploadAchievementImage = multer({
    storage:createStorage("achievement_images",["jpg","jpeg","png"]),
    fileFilter:imageFilter,
    limits:{fileSize: 2 * 1024 * 1024}
}).single("achievement_image");

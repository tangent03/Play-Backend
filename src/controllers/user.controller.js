import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req,res) => {
    //get user details from frontend
    //validation - not empty
    //check if user already exists : username , email
    //check for images and check for avatar
    //upload them to cloudinary , avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    // check for user creation
    //return response

    const {fullName , email, username, password} = req.body
    console.log("email:",email);

    if (
        [fullName , email, username, password].some((field) => field?.trim().length === "")
    ){  
        throw new ApiError(400,"All fields are required")
    }

    const existedUser =User.findOne({
        $or: [
            {
                username
            },
            {
                email
            }
        ]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
    }
    

    const avatarLocalPath =req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar files are required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar upload failed")
    }

   const user = await User.create({
        fullName,
        email,
        username:username.toLowerCase(),
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
    })


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"User creation failed")
    }


    return res.status(201).json(new ApiResponse(201,createdUser,"User Created Successfully"))
})




export {registerUser}
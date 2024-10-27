const { User } = require("../models");
const config = require("../config/config");
const bcrypt = require("bcrypt");
const { generateToken } = require("./userToken");
const jwt = require("jsonwebtoken");
const { Logger } = require("../utils");
const { userDTO } = require("../DTO");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const getUserByEmail = async ({ userEmail }) => {
    try {
        Logger.info(`Fetching user by email: ${userEmail}`);
        const user = await User.findOne({ userEmail: userEmail });
    	if (user) return user;
        else throw new Error("User not found");
    } catch (error) {
        Logger.error(`Error fetching user by email: ${error.message}`);
        throw error;
    }
};

const loginUser = async ({ userEmail, userPassword }) => {
    try {
        Logger.info(`Attempting login for user: ${userEmail}`);
        const query = {
            $or: [{ userEmail: userEmail }, { userName: userEmail }],
        };
        const user = await User.findOne(query);
        if (!user) {
            const error = new Error("Incorrect Email or User Not Found");
            error.status = 404;
            Logger.error(error.message);
            throw error;
        }
        const verifyPassword = await bcrypt.compare(userPassword, user.userPassword);
        if (!verifyPassword) {
            const error = new Error("Incorrect Password");
            error.status = 401;
            Logger.error(error.message);
            throw error;
        }
        const { accessToken, refreshToken } = await generateToken(user);
        Logger.info(`User logged in successfully: ${userEmail}`);
        return { userId: user._id, userName: user.userName, accessToken, refreshToken };
    } catch (error) {
        Logger.error(`Error logging in user: ${error.message}`);
        throw error;
    }
};

// Create User
const createUser = async (userData) => {
    try {
        Logger.info("Creating a new user");
        const newUserDTO = new userDTO.UserDTO(userData);
        const salt = await bcrypt.genSalt(Number(config.SALT));
        const hashPassword = await bcrypt.hash(newUserDTO.userPassword, salt);
        newUserDTO.userPassword = hashPassword;
        const user = await User.create(newUserDTO);
        Logger.info(`User created successfully with ID: ${user._id}`);
        return user;
    } catch (error) {
        Logger.error(`Error creating user: ${error.message}`);
        throw error;
    }
};

// Update User by ID
const updateUser = async (userUpdateData) => {
    try {
        Logger.info(`Updating user with ID: ${userUpdateData.id}`);
        const userUpdateDTO = new userDTO.UserUpdateDTO(userUpdateData);
        if (userUpdateDTO.userPassword) {
            const salt = await bcrypt.genSalt(Number(config.SALT));
            const hashPassword = await bcrypt.hash(userUpdateDTO.userPassword, salt);
            userUpdateDTO.userPassword = hashPassword;
        }
        const user = await User.findOneAndUpdate(
            { _id: userUpdateDTO.id },
            userUpdateDTO,
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );
        Logger.info(`User updated successfully with ID: ${user._id}`);
        return user;
    } catch (error) {
        Logger.error(`Error updating user: ${error.message}`);
        throw error;
    }
};

// Delete User by ID
const deleteUser = async ({ id }) => {
    try {
        Logger.info(`Deleting user with ID: ${id}`);
        const user = await User.findById({ _id: id });
        await user.remove();
        Logger.info(`User deleted successfully with ID: ${id}`);
    } catch (error) {
        Logger.error(`Error deleting user: ${error.message}`);
        throw error;
    }
};

// Get User Data
const getUserData = async (accessToken) => {
    try {
        Logger.info("Fetching user data");
        const decoded = jwt.verify(accessToken, config.ACCESS_TOKEN_PRIVATE_KEY);
        const userId = decoded._id;
        const result1 = await User.findOne(
            { _id: userId },
            { userPassword: 0, _id: 0, __v: 0 }
        );
        if (!result1) {
            throw new Error("User not found");
        }
        Logger.info(`User data fetched successfully for ID: ${userId}`);
        return result1;
    } catch (error) {
        Logger.error(`Error fetching user data: ${error.message}`);
        throw error;
    }
};

// Get All User Data
const getAllUserData = async (accessToken) => {
    try {
        Logger.info("Fetching all user data");
        const decoded = jwt.verify(accessToken, config.ACCESS_TOKEN_PRIVATE_KEY);
        if (decoded.userRole === 3) {
            const allUsers = await User.find();
            Logger.info("All user data fetched successfully");
            return allUsers;
        } else {
            throw new Error("You are not authorized to view this page");
        }
    } catch (error) {
        Logger.error(`Error fetching all user data: ${error.message}`);
        throw error;
    }
};

// Get User Role
const getUserRole = async ({ token }) => {
    try {
        Logger.info("Fetching user role");
        if (token) {
            const decoded = jwt.verify(token, config.ACCESS_TOKEN_PRIVATE_KEY);
            Logger.info(`User role fetched successfully for ID: ${decoded._id}`);
            return decoded.userRole;
        } else {
            throw new Error("No token found");
        }
    } catch (error) {
        Logger.error(`Error fetching user role: ${error.message}`);
        throw error;
    }
};

// Get User by UserName
const getUserByUserName = async (userName) => {
    try {
        Logger.info(`Fetching user by username: ${userName}`);
        const user = await User.findOne({ userName }, { userPassword: 0, _id: 0, __v: 0 });
        if (!user) {
            const error = new Error("User Not Found");
            error.status = 404;
            Logger.error(error.message);
            throw error;
        }
        Logger.info(`User fetched successfully by username: ${userName}`);
        return user;
    } catch (error) {
        Logger.error(`Error fetching user by username: ${error.message}`);
        throw error;
    }
};

// Upload Avatar
const uploadAvatar = async ({ image, userId }) => {
    try {
        Logger.info(`Uploading avatar for user ID: ${userId}`);
        cloudinary.config({
            secure: true,
            cloud_name: config.CLOUDINARY_NAME,
            api_key: config.CLOUDINARY_API_KEY,
            api_secret: config.CLOUDINARY_API_SECRET,
        });

        const user = await User.findById(userId);
        if (user && user.userAvatar) {
            const publicId = extractPublicId(user.userAvatar);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        const result = await cloudinary.uploader.upload(image.tempFilePath);
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { userAvatar: result.url },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );

        fs.unlink(image.tempFilePath, (err) => {
            if (err) {
                Logger.error("Failed to delete temp file:", err);
            } else {
                Logger.info("Temp file deleted successfully");
            }
        });

        Logger.info(`Avatar uploaded successfully for user ID: ${userId}`);
        return { url: result.url, user: updatedUser };
    } catch (error) {
        Logger.error(`Error uploading avatar: ${error.message}`);
        throw new Error("Image upload failed: " + error.message);
    }
};

// Helper function to extract the public_id from a Cloudinary URL
const extractPublicId = (url) => {
    const parts = url.split('/');
    const filename = parts.pop();
    const publicId = filename.split('.')[0];
    return publicId;
};

module.exports = {
    getUserData,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    getUserByEmail,
    getUserRole,
    getUserByUserName,
    uploadAvatar,
    getAllUserData,
};
const { User } = require("../models");
const config = require("../config/config");
const bcrypt = require("bcrypt");
const { generateToken } = require("./userToken");
const jwt = require("jsonwebtoken");
const error = require("../middleware/error");
const {userDTO} = require("../DTO");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const getUserByEmail = async ({ userEmail }) => {
	try {
		const user = await User.findOne({ userEmail: userEmail });
		if (user) return user;
	} catch (error) {
		throw error;
	}
};

const loginUser = async ({ userEmail, userPassword }) => {
	try {
		const query = {
			$or: [{ userEmail: userEmail }, { userName: userEmail }],
		};
		const user = await User.findOne(query);
		if (!user) {
			const error = new Error("Incorrect Email or User Not Found");
			error.status = 404;
			throw error;
		}
		const verifyPassword = await bcrypt.compare(userPassword, user.userPassword);
		if (!verifyPassword) {
			const error = new Error("Incorrect Password");
			error.status = 401;
			throw error;
		}
		const { accessToken, refreshToken } = await generateToken(user);
		return { userId: user._id, userName: user.userName, accessToken, refreshToken };
	} catch (error) {
		// Optionally, log the error or handle it in another way
		throw error;
	}
};
//Create User
const createUser = async (userData) => {
    try {
        // Destructure properties from the DTO
		const newUserDTO = new userDTO.UserDTO(userData);
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(Number(config.SALT));
        const hashPassword = await bcrypt.hash(newUserDTO.userPassword, salt);
		newUserDTO.userPassword = hashPassword;
        // Create the user
        const user = await User.create(newUserDTO);

        return user;
    } catch (error) {
        throw error;
    }
};


//Update User by ID

const updateUser = async (userUpdateData) => {
    try {
        // Destructure properties from the DTO
		const userUpdateDTO = new userDTO.UserUpdateDTO(userUpdateData);
        // Prepare the update object

        // If a new password is provided, hash it
        if (userUpdateDTO.userPassword) {
            const salt = await bcrypt.genSalt(Number(config.SALT));
            const hashPassword = await bcrypt.hash(userUpdateDTOuserPassword, salt);
            userUpdateDTO.userPassword = hashPassword;
        }

        // Find and update the user
        const user = await User.findOneAndUpdate(
            { _id: userUpdateDTO.id },
            userUpdateDTO,
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );

        return user;
    } catch (error) {
        throw error;
    }
};


//Delete User by ID

const deleteUser = async ({ id }) => {
	const user = await User.findById({ _id: id });

	await user.remove();
};

//Get User Data

const getUserData = async (accessToken) => {
	try {
		const decoded = jwt.verify(
			accessToken,
			config.ACCESS_TOKEN_PRIVATE_KEY
		);
		const userId = decoded._id;
		const result1 = await User.findOne(
			{ _id: userId },
			{ userPassword: 0, _id: 0, __v: 0 }
		);

		if (!result1) {
			throw new Error("User not found");
		}
		return result1;
	} catch (error) {
		throw error;
	}
};

const getAllUserData = async (accessToken) => {
	try {
			const decoded = jwt.verify(accessToken, config.ACCESS_TOKEN_PRIVATE_KEY);
      if (decoded.userRole === 3) {
        const allUsers = await User.find();
        return allUsers;
      } else {
        throw new Error("You are not authorized to view this page");
      }
	} catch (error) {
		throw error;
	}
};

const getUserRole = async({ token }) => {
  try {
    if(token)
    {
      const decoded = jwt.verify(
        token,
        config.ACCESS_TOKEN_PRIVATE_KEY
      );
      return decoded.userRole; // change to user role 
    }
    else throw new Error("No token Found")
  } catch (error) {
    throw error;
  }
}
const getUserByUserName = async (userName) => {
  try {
    const user = await User.findOne({ userName }, { userPassword: 0, _id: 0, __v: 0 });
    if (!user) {
      const error = new Error("User Not Found");
      error.status = 404; // Custom status code
      throw error;
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const uploadAvatar = async ({ image, userId }) => {
  try {
    // Configure Cloudinary
    cloudinary.config({
      secure: true,
      cloud_name: config.CLOUDINARY_NAME,
      api_key: config.CLOUDINARY_API_KEY,
      api_secret: config.CLOUDINARY_API_SECRET,
    });

    // Fetch the current user to get the current avatar's public_id
    const user = await User.findById(userId);
    
    if (user && user.userAvatar) {
      // Extract the public_id from the user's avatar URL
      const publicId = extractPublicId(user.userAvatar);
      
      if (publicId) {
        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Upload the new image to Cloudinary
    const result = await cloudinary.uploader.upload(image.tempFilePath);

    // Update the user's avatar URL in the database
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { userAvatar: result.url }, // Update the avatar URL
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    // Delete the temporary file after successful upload
    fs.unlink(image.tempFilePath, (err) => {
      if (err) {
        console.error("Failed to delete temp file:", err);
      } else {
        console.log("Temp file deleted successfully");
      }
    });

    // Return the URL of the new image and the updated user data
    return { url: result.url, user: updatedUser };

  } catch (error) {
    // If there is an error, throw it
    throw new Error("Image upload failed: " + error.message);
  }
};

// Helper function to extract the public_id from a Cloudinary URL
const extractPublicId = (url) => {
  const parts = url.split('/');
  const filename = parts.pop(); // Extract the filename (e.g., abc123.jpg)
  const publicId = filename.split('.')[0]; // Remove the extension and get the public_id
  return publicId;
};



module.exports = { getUserData, createUser, updateUser, deleteUser, loginUser, getUserByEmail, getUserRole,getUserByUserName,uploadAvatar};

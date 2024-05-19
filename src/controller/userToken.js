const jwt = require('jsonwebtoken');
const config = require("../config/config");
const {UserToken} = require("../models");

const createUserToken = async ({
    userId,
    token
}) => {
    const resultToken = await UserToken.create(
        {
            userId,
            token,
        }
    )
    return resultToken;
}


const generateToken = async(user) =>{
    try {
        const payload = {_id:user._id , userRole:user.userRole};
        
        const accessToken = jwt.sign(
            payload,
            config.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: config.ACCESS_TOKEN_EXPIRE_IN}
        )
        const refreshToken = jwt.sign(
            payload,
            config.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: config.REFRESH_TOKEN_EXPIRE_IN}
        )

        const userToken = await UserToken.findOne({userId: user._id});
        if(userToken) await userToken.remove();
        
        await createUserToken({userId:user._id , token:refreshToken});
        
        return Promise.resolve({accessToken , refreshToken});

    } catch (error) {
        return Promise.reject(error);
    }
}

const refreshAccessToken = async(refreshToken) => {
    try {

        const decodedToken = jwt.verify(refreshToken, config.REFRESH_TOKEN_PRIVATE_KEY);
        const userToken = await UserToken.findOne({ token: refreshToken });
        if (!userToken) {
        throw new Error('Refresh token not found');
        }
        if(!decodedToken) 
        {
            throw new Error('Invalid Token');
        }
        const accessToken = jwt.sign({ _id: decodedToken._id }, config.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: '20m',
          });

        return {accessToken};
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {createUserToken,generateToken, refreshAccessToken};
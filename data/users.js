import { users } from "../config/mongoCollections.js";
import helperMethods from "./../helpers.js";

import bcrpyt from 'bcryptjs'

const createUser = async (firstName, lastName, emailAddress, phoneNumber, password) => {
    password = await bcrpyt.hash(password, 10)

    try {
        const userCollection = await users()
        const userID = await helperMethods.generateObjectID()
        const newUser = {
            _id: userID.toString(),
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            phoneNumber: phoneNumber,
            password: password
        }

        const newInsertInformation = await userCollection.insertOne(newUser)
        return newUser;
    } catch (err) {
        throw new Error(err)
    }
}

const searchUser = async (emailAddress, password) => {
    try {
        const userCollection = await users();
        const userInformation = await userCollection.find({
            emailAddress: emailAddress
        }).toArray()

        if(userInformation.length>0) {
            const passwordCheck = await bcrpyt.compare(password, userInformation[0].password)
            if (!passwordCheck) {
                throw 'Username/Password incorrect'
            } else {
                helperMethods.configureDotEnv()
                const returnObject = {}
                const hashedID = await helperMethods.encyptValue(userInformation[0]._id, process.env.ENCRYPTION_KEY)
                returnObject.userID = hashedID
                if(userInformation[0].role) {
                    returnObject.role = 'admin'
                }
                return returnObject
            }
        } else {
            return 'Username/Password incorrect'
        }


    } catch (err) {
        throw new Error(err)
    }
}

const preFillUserData = async (userID) => {
    try {
        helperMethods.configureDotEnv()
        const decryptedID = await helperMethods.decryptValue(userID, process.env.ENCRYPTION_KEY)
        const userCollection = await users()
        const userInformation = await userCollection.find(
            { _id: decryptedID }, // Query filter
            { 
                projection: { 
                    firstName: 1, 
                    lastName: 1, 
                    emailAddress: 1, 
                    phoneNumber: 1, 
                    _id: 1, 
                } 
            }
        ).toArray();
        if(userInformation.length>0) {
            return userInformation[0]
        } else {
            throw new Error('User not found')
        }
    } catch (err) {
        throw new Error(err)
    }
}
const methods = {
    createUser,
    searchUser,
    preFillUserData
};

export default methods;

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
            // console.log(userInformation[0])
            const passwordCheck = await bcrpyt.compare(password, userInformation[0].password)
            if (!passwordCheck) {
                console.log(password)
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
const methods = {
    createUser,
    searchUser
};

export default methods;

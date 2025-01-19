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
const methods = {
    createUser
};

export default methods;

import dotenv from "dotenv";
import xss from "xss";
import { ObjectId } from "mongodb";

/**
 * Function to configure read from .env file
 * @param none
 * @return
 */
const configureDotEnv = () => {
	dotenv.config();
};

/**
 * Function to validate if an argument was supplied
 * @param {any} arg - argument to check if it supplied
 * @param {string} argName - argument name to throw an error message (Optional)
 */
const argumentProvidedValidation = (arg, argName) => {
	if (!arg) {
		throw `${argName || "argument"} value not provided`;
	}
};

/**
 * Function to validate primitive types of variable
 * @param {any} arg - argument to check for primitive type
 * @param {string} argName - argument name to throw an error message
 * @param {string} primitiveType - primitive type to validate argument with
 */
const primitiveTypeValidation = (arg, argName, primitiveType) => {
	switch (primitiveType.toLowerCase()) {
		case "string":
			arg = arg.trim();
			if (typeof arg !== "string" || arg.length === 0) {
				throw `${
					argName || "argument"
				} is not a string (OR) is an empty string`;
			}
			arg = xss(arg);
			break;
		case "object":
			if (typeof arg !== "object" || Object.keys(arg).length === 0) {
				throw `${
					argName || "argument"
				} is not an object (OR) is an empty object`;
			}
			break;
		default:
			throw `Invalid ${primitiveType} to validate against ${arg}`;
	}
	return arg;
};

/**
 * Function to generate an object ID for the given value
 * @param {string} value - value to create an Object ID (Optional)
 */
const generateObjectID = async (value) => {
	return value ? new ObjectId(value) : new ObjectId();
};

/**
 * Function to validate if passed value is a valid object ID
 * @param {string} value
 * @returns {boolean}
 */
const validateObjectID = async (value) => {
	return ObjectId.isValid(value);
};

const methods = {
	configureDotEnv,
	argumentProvidedValidation,
	primitiveTypeValidation,
	generateObjectID,
	validateObjectID,
};

export default methods;

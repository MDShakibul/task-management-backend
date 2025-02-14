import nodemailer from "nodemailer";
import CryptoJS from "crypto-js";
import config from "../config/index.js";

const generateRandom5DigitNumber = () => {
    const min = 10000; 
    const max = 99999; 
  
    
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  
    return randomNum;
  }

  const generateUniqueNumber = () => {
    const timestamp = Date.now().toString();
    const uniqueNumber = timestamp.slice(-16);  // Get the last 16 characters
    return uniqueNumber;
  }

  // Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config?.email_user,
    pass: config?.email_password,
  },
});

// Generate Reset Token using CryptoJS
const generateResetToken = () => {
  const rawToken = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  return rawToken;
};

  export const utils = {
    generateRandom5DigitNumber,
    generateUniqueNumber,
    transporter,
    generateResetToken
  }


  
  
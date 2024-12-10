import bcrypt from "bcryptjs"; // For Password bcrypt
import jsonwebtoken from "jsonwebtoken"; // for create Authentication token
import userModel from "../models/userModel.js";
import transporter from "../Config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User Already Exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save(); //This line is used for save the user in the database

    /** Generate JWT Token */
    const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    /** We can send token by the help of cookie function */
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    /** Write functinality of sending mail on email */
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome sunny",
      text: `Welcome sunny your mail functionality is working properly your email is ${email}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
    // await transporter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and Password are Required",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }
    const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    /** We can send token by the help of cookie function */
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, message: "Logout" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Account already verified",
      });
    }

    const otp = String(Math.floor(10000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify Your Account using this OTP`,
    };

    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message:` Verification OTP Sent On Email ${otp}`,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found",
      });
    }
    if (user.verifyOtp == "" || user.verifyOtp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP Expired",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({
      success: true,
      message: "Email Verified Successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// Send password Reset OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found",
      });
    }

    const otp = String(Math.floor(10000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is resetting your password is ${otp}. use this  OTP for reseting password`,
    };

    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: `OTP Sent On Email ${otp}`,

    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


// Reset User Password
 export const resetPassword = async(req,res)=>{
  const {email,otp,newPassword} = req.body;

  if(!email || !otp || !newPassword){
    return res.json({
      success: false,
      message: "Email, otp, And new password are required",
    });
  }

  try {

    const user = await userModel.findOne({email});

    if(!user){
      res.json({
        success:false,
        message:"User Not Found"
      })
    }

    if(user.resetOtp === "" || user.resetOtp !== otp){
      res.json({
        success:false,
        message:"Invalid OTP"
      })
    }

    if(user.resetOtpExpireAt < Date.now()){
      res.json({
        success:false,
        message:"OTP Expire"
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
     user.password = hashedPassword;
     user.resetOtp= "";
     user.resetOtpExpireAt = 0;

     await user.save()

     return res.json({
      success:true,
      message:"Password has been reset successfully"
     })

    
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
 }

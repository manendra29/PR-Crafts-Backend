export const generateJwtToken=(user,message,statusCode,res)=>{
    const token=user.generateJsonWebToken();
    // res.status(statusCode).cookie("token",token,{
    //     expires:new Date(Date.now()+7*24*60*60*1000),
    //     httpOnly:true
    // }).json({
    //     success:true,
    //     message,
    //     user,
    //     token
    // });   
    
    
    res.status(statusCode)
  .cookie("token", token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV == "production", // Secure only in production
    sameSite: "None", // Needed for cross-origin requests
  })
  .json({
    success: true,
    message,
    user,
    token,
  });
}
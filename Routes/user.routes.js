const express=require("express")
const userRoutes=express.Router()
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const { userModule } = require("../Module/user.moduke")
const { validator } = require("../middleware/validator.middleware")
const { blacklist } = require("../blacklist")
userRoutes.post("/register",validator,(req,res)=>{
    const {name,email,pass}=req.body
    const user=userModule.findOne({email})
    if(user.email==email){
       
       res.json({msg:"user already registerd"}) 
    }else{
        try {
            bcrypt.hash(pass,5,async(err,hash)=>{
                if(err){
                    console.log("pass is not hashed")
                }else{
                  const userdata=new userModule({name,email,pass:hash})
                await userdata.save()
                res.status(200).json({msg:"pass has been hashed"})
    
                }
            })
        } catch (error) {
            res.status(400).json({msg:"Something is Wrong"})
        }
        
    }
 
    
})
userRoutes.post("/login",validator,async(req,res)=>{
    // logic here
    const {email,pass}=req.body
    try {
        const user= await userModule.findOne({email})
        if(user){
            bcrypt.compare(pass,user.pass,(err,result)=>{
                if(result){
                    const token=jwt.sign({userId:user._id,username:user.name},process.env.secret)
                    res.status(200).json({msg:"Login SUccesfully",token})

                }else{
                    res.status(200).json({msg:"Plese Login"})
                }
            })
        }else{
            res.status(200).json({msg:"user is not found"})
        }
       
    } catch (error) {
        res.status(400).json({msg:"Something is error"})
    }

})
userRoutes.get("/logout",(req,res)=>{
    const token=req.headers.authorization?.split(" ")[1]
    try {
        if(token){
            blacklist.push(token)
            res.json("logout ")
        }else{
            res.json("not authorised")
        }
       
    } catch (error) {
        
    }
})
module.exports={
    userRoutes
}
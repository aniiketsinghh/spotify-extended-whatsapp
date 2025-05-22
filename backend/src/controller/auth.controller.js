import { User } from "../models/user.model.js";

export const authCallback = async (req, res) => {
    try{
        const { id, firstName, lastName, imagreUrl } = req.body;
        const user = await User.findOne({ clerkId: id });

        if(!user){
            const newUser = await User.create({
                fullName: `${firstName} ${lastName}`,
                imageUrl: imagreUrl,
                clerkId: id
            });
            return res.status(201).json({message:"User created successfully", user:newUser});
        }
    }catch(err){
        console.log("error in admin controller",err)
        res.status(500).json({message:"Internal server error"})
    };
}
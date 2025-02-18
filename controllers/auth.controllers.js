import asyncHandler from "../utils/asyncHandler.js";
import { Donors } from "../models/Donor.models.js";
import { NGO } from "../models/Ngo.models.js";
const handleLogin = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email){
        throw new Error("Email not found");
        res.status(404).send("Email not found");
    }
    if(!password){
        throw new Error("Password not found");
        res.status(404).send("Password not found");
    }
});

const handleRegister = asyncHandler(async (req, res) => {
    console.log("register request successfull")
    const { role, email, password } = req.body;
    console.log(req.body)
    if(!email){
        throw new Error("Email not found");
    }
    if(!password){
        throw new Error("Password not found");
    }
    if(!role){
        throw new Error("Role not found");
    }

    if(role === "Donor"){
        const donor = await Donors.findOne({role:"donor"});
        if(!donor){
            const newDonor = await Donors.create({
                name: " ",
                email,
                password,
            })
            console.log("New donor successfully created")
            res.status(200).send("New donor successfully created")
            return newDonor;
        }else{
            return res.status(409).send("User already exists")
        }
    }else{
        
    }
});

export { handleLogin, handleRegister };

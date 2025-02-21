import asyncHandler from "../utils/asyncHandler.js";
import { Donors } from "../models/Donor.models.js";
import { NGO } from "../models/Ngo.models.js";

const handleLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        throw new Error("Email not found");
    }
    if (!password) {
        throw new Error("Password not found");
    }

    const user = await Donors.findOne({email}) || await NGO.findOne({email})
    if(!user) {
        res.status(401).send("Credentials not found")
        throw new Error("User doesn't exist")   
    }
        
    
    const userType = user.collection.modelName
    if(await user.matchPassword(password)){
        const access_token = await user.generateAccessToken(userType);
        // console.log(access_token)
        const options = {
            secure: true,
            httpOnly : true,
            credentials : true
        }
        return res
            .cookie("access_token",access_token,options)
            .status(200)
            .json({
                role: userType,
                message: "Login successful"
            })
    }else{
        res.status(404).send("Incorrect password")
        throw new Error("Incorrect password")
    }
});

// register complete
const handleRegister = asyncHandler(async (req, res) => {
    const { role, email, password } = req.body;
    // console.log(req.body);
    if (!email) {
        throw new Error("Email not found");
    }
    if (!password) {
        throw new Error("Password not found");
    }
    if (!role) {
        throw new Error("Role not found");
    }

    if (role.toLowerCase() === "donors" || role.toLowerCase() === "donor") {
        const donor = await Donors.findOne({ email });
        if (!donor) {
            const newDonor = await Donors.create({
                name: " ",
                email,
                password: password.trim(),
            });
            console.log("New donor successfully created");
            res.status(200).send("New donor successfully created");
        } else {
            console.log("User exists");
            return res.status(409).send("User already exists");
        }
    } else {
        const ngo = await NGO.findOne({ email });
        if (!ngo) {
            const newNGO = await NGO.create({
                name: " ",
                email,
                password,
            });
            console.log("New ngo successfully created");
            res.status(200).send("New ngo successfully created");
        } else {
            console.log("User exists");
            return res.status(409).send("User already exists");
        }
    }
});

export { handleLogin, handleRegister };

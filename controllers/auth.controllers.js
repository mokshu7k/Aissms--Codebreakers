import asyncHandler from "./utils/asyncHandler.js";

const handleLogin = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email){}
});

const handleRegister = asyncHandler(async (req, res) => {
    const { role, email, password } = req.body;
    if (!role) {
    }
});

export { handleLogin, handleRegister };

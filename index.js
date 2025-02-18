import connectDB from "./db/index.js";
import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Listening on PORT: ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(`Error connecting to database: ${err}`);
    });

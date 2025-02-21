import connectDB from "./db/index.js";
import setUpSocket from "./db/socket.js";
import { app } from "./app.js";
import dotenv from "dotenv";
import "./jobs/expirycheck.js";

dotenv.config({
    path: "./.env",
});
const httpServer = createServer(app);
setUpSocket(httpServer);

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Listening on PORT: ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(`Error connecting to database: ${err}`);
    });

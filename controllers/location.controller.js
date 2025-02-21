import { Server } from "socket.io";
import {exiftool} from "exiftool-vendored";
import fs from "fs";
import path from "path";
import axios from "axios";
const extractLocationFromImage = async (imageURL, socket, roomId, receiverId) => {
    try {
        const response = await axios.get(imageURL, { responseType: "arraybuffer" });
        const fileName = path.join(__dirname, "../uploads", `${Date.now()}_image.jpg`);
        fs.writeFileSync(fileName, Buffer.from(response.data));

        const metadata = await exiftool.read(fileName);

        if (metadata.GPSLatitude && metadata.GPSLongitude) {
            const latitude = metadata.GPSLatitude;
            const longitude = metadata.GPSLongitude;
            const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

            // Emit GPS data and Google Maps link
            socket.emit("gpsData", {
                success: true,
                latitude,
                longitude,
                mapsLink,
                message: "GPS data extracted successfully.",
            });

            // Also send the Google Maps link as a message in chat
            io.to(roomId).emit("receiveMessage", {
                senderId: "system", // System message
                receiverId,
                message: `Delivery completed! View the location here:\n ${mapsLink}`,
                image: null,
                timestamp: new Date(),
            });
        } else {
            socket.emit("gpsData", {
                success: false,
                message: "No GPS data found in the image.",
            });
        }
    } catch (error) {
        console.log("Location not given:", error);
        return { success: false, message: "Error processing image." };
    }
};


export default extractLocationFromImage;
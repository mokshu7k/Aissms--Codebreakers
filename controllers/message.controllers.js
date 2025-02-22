import messageSchema from "../models/message.models.js";
import cloudinary from "../db/cloudinary.js";
import extractLocationFromImage from "./location.controller.js";


const handleChatEvents = (io, socket,activeChatRooms) => {
    console.log("Received event:",socket.id);
    // socket.on("startChatRoom", ({donorId, ngoId}) => {
    //     console.log(`Received event: startChatRoom for Donor: ${donorId}, NGO: ${ngoId}`);    
    //     if (!donorId || !ngoId) {
    //         console.log(" Missing donorId or ngoId");
    //         return;
    //     }
    socket.on("startChatRoom", (data) => {  // Accepts the data object directly
        console.log("✅ startChatRoom event triggered!", data);
    
        if (typeof data === "string") {
            try {
                data = JSON.parse(data); // Convert to object
            } catch (error) {
                console.log("❌ Failed to parse JSON payload", error);
                return;
            }
        }
    
        if (!data || !data.donorId || !data.ngoId) {
            console.log("❌ Invalid payload received", data);
            return;
        }
    
        const { donorId, ngoId } = data;
        const roomId = `${donorId}_${ngoId}`;
        socket.join(roomId);
        activeChatRooms.set(roomId, { donorId, ngoId, hasGeoTaggedImage: false });
    
        console.log(`Chat has started between ${donorId} & ${ngoId}`);
        io.to(roomId).emit("chatStarted", { message: "Chat has started." });   
    });
    
    
    
    socket.on("getMessages", async (data) => {
        try {
            const { roomId } = JSON.parse(JSON.stringify(data));
            console.log("✅ getMessages event triggered!");
            
            const messages = await messageSchema.find({ roomId }).sort({ timestamp: 1 });
            socket.emit("loadMessages", messages);
        } catch (error) {
            console.error("Error while fetching the messages:", error);
        }
    });
    
    socket.on("sendMessages", async (data) => {
        try {
            const { roomId, senderId, receiverId, text, image, isFinalDelivery } = JSON.parse(JSON.stringify(data));
            let imageURL;
    
            if (image) {
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    folder: "chat_images",
                });
                imageURL = uploadResponse.secure_url;
            }
    
            const newMessage = new messageSchema({
                roomId,
                senderId,
                receiverId,
                text,
                image: imageURL,
            });
    
            await newMessage.save(); // Save the message in the database
    
            io.to(roomId).emit("receiveMessage", {
                roomId,
                senderId,
                receiverId,
                text,
                image: imageURL,
                timestamp: newMessage.timestamp,
            });
    
            if (isFinalDelivery && imageURL) {
                const gpsData = await extractLocationFromImage(imageURL);
                if (gpsData.success) {
                    if (activeChatRooms.has(roomId)) {
                        activeChatRooms.get(roomId).hasGeoTaggedImage = true;
                    }
                    io.to(roomId).emit("gpsData", gpsData);
                }
            }
        } catch (error) {
            console.error("Error while saving the messages:", error);
        }
    });
} 

export default handleChatEvents;

import messageSchema from "../models/message.models.js";
import cloudinary from "cloudinary";
import extractLocationFromImage from "./location.controller.js";

const handleChatEvents = (io, socket,activeChatRooms) => {
    socket.on("startChatRoom", ({donorId, ngoId})=>{
        const roomId = `${donorId}_${ngoId}`;
        socket.join(roomId);
        activeChatRooms.set(roomId,{donorId,ngoId});
        console.log(`Chat has started between ${donorId} & ${ngoId}`);
        io.to(roomId).emit("chatStarted", {message: "Chat has started."});   
    });
    
    socket.on("getMessages", async({roomId}) =>{
        try{
            const messages = await messageSchema.find({roomId}).sort({timestamp: 1});
            socket.emit("loadMessages", messages);
        }
        catch(error){
            console.error("Error while fetching the messages: ", error)
        }
    })
    
    socket.on("sendMessages", async({roomId, senderId,receiverId, text, image, isFinalDelivery}) =>{
        try{
            let imageURL;
            if(image){
                const uploadResponse = await cloudinary.uploader.upload(image,{
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
            })
    
            await newMessage.save();//used to save the message in the database

            io.to(roomId).emit("receiveMessage", {
                roomId,
                senderId,
                receiverId,
                text,
                image: imageURL,
                timestamp: newMessage.timestamp,
            });

            if(isFinalDelivery && imageURL){
                const gpsData = await extractLocationFromImage(imageURL);
                io.to(roomId).emit("gpsData", gpsData);
            }
        }
        catch(error){
            console.error("Error while saving the messages", error);
        }
    })
} 

export default handleChatEvents;

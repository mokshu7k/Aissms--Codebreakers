import { Server } from 'socket.io';
import { createServer } from 'http';
// const app = express();
// const httpServer = createServer(app);

import handleChatEvents from "../controllers/message.controllers.js";
const activeUsersMap = new Map();
const activeChatRooms = new Map();

let io;

const setUpSocket = (httpServer) =>{
    io = new Server(httpServer,{
        cors:{
            origin : process.env.CORS_ORIGIN,
            methods: ["GET","POST"],
            credentials: true,
        }
    });
    

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        const userType = socket.handshake.query.userType;
        if(!userId || !userType){
            console.log("User ID not provided during connection");
        }
        activeUsersMap.set(userId, socket.id);//id given as soon as you join
        console.log(`User connected:${userType} ${userId} with socket ID: ${socket.id}`);        
        
        handleChatEvents(io,socket,activeChatRooms);
        socket.on("endDelivery", ({ donorId, ngoId }) => {
            const roomId = `${donorId}_${ngoId}`;
            const roomData = activeChatRooms.get(roomId);
            
            if (!roomData) {
                io.to(roomId).emit("error", { message: "Chat room not found." });
                return;
            }
        
            if (!roomData.hasGeoTaggedImage) {
                io.to(roomId).emit("error", { message: "At least one geo-tagged image must be sent before ending the chat." });
                return;
            }
        
            activeChatRooms.delete(roomId);
            io.to(roomId).emit("deliveryCompleted", { message: "Delivery completed, chat ended." });
        });
        
    })
    return io;
}
const findUserRoom = (userId) =>{
    for(const[roomId, users] of activeChatRooms.entries()){
        if(users.donorId == userId || users.ngoId == userId) return roomId;
    }
    return null;
}

const handleDisconnect = (socket, userId) => {
    activeUsersMap.delete(userId);
    const roomId = findUserRoom(userId);
    if (roomId) {
        socket.leave(roomId);
    }
};



export default setUpSocket;


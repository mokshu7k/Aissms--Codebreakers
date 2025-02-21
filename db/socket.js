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
            orgin : process.env.CORS_ORIGIN,
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
        socket.on("disconnecting", (reason) =>{
            const roomId = findUserRoom(userId);
            if(roomId && activeChatRooms.has(roomId)){
                console.log(`Preventing disconnection for ${userId} - delivery ongoing.`);
                return;
            }
            // handleDisconnect(socket, userId)
        })
        socket.on("endDelivery",({donorId,ngoId})=> {
            const roomId = `${donorId}_${ngoId}`;
            if (activeChatRooms.has(roomId)) {
                activeChatRooms.delete(roomId);
                io.to(roomId).emit("deliveryCompleted", { message: "Delivery completed, chat ended." });

                console.log(`Delivery completed for room ${roomId}, disconnecting users.`);
                handleDisconnect(socket, donorId);
                handleDisconnect(socket, ngoId);
            }
    })
    })
}
const findUserRoom = (userId) =>{
    for(const[roomId, users] of activeChatRooms.entries()){
        if(users.donorId == userId || users.ngoId == userId) return roomId;
    }
    return null;
}

const handleDisconnect = (socket, Id) =>{
    activeUsersMap.delete(userId);
    socket.leave(findUserRoom(userId));
}



export default setUpSocket;


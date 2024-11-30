import {Server} from 'socket.io'
import http from 'http'
import express from 'express'

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:["https://localhost:5173"],
        // credentials: true,
    },
});

//used to store online users
const userSocketMap = {}; //{userId: socketId}...The userId will be coming from database

io.on("connection", (socket)=>{
    console.log('A user connected', socket.id)

    //Now we will pass the query.userId from the client
    const userId = socket.handshake.query.userId
    //Now the user became online, we have updated in the server
    if(userId) userSocketMap[userId]= socket.id

    //io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("A user disconnected", socket.id)
        //When we diconnect, deleting it from userSocketMap, and letting everyone know about through io.emit()
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export{io, app, server};
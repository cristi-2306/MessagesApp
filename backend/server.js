const express = require('express');
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require("./routes/messageRoutes");
const multer = require('multer');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const { v4: uuidV4 } = require('uuid');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"]
    }
});

dotenv.config();
connectDB();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.get('/', (req, res) => {
    res.send("API is running");
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/upload", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("joinVideoCall", ({ chatVideoCallId }) => {
        console.log(`User ${socket.id} joining video call room: ${chatVideoCallId}`);
        socket.join(chatVideoCallId);
    });

    socket.on("initiateCall", ({ chatVideoCallId, from, signalData, name }) => {
        console.log(`[Server] Initiating call from ${from} in room ${chatVideoCallId}`);

        socket.to(chatVideoCallId).emit('callUser', { signal: signalData, from: from, name: name });
        console.log("Signal data for initiate call sent:", signalData);
    });

    socket.on("answerCall", (data) => {
        console.log(`[Server] Call answered by: ${data.to}`);
        
        io.to(data.to).emit("callAccepted", data.signal);
    });

    socket.on("error", (err) => {
        console.error("Socket error:", err);
    });

    socket.onAny((event, ...args) => {
        console.log(`Event: ${event}, Args:`, args);
    });

    socket.on('disconnect', () => {
        console.log("Client disconnected:", socket.id);
        socket.broadcast.emit('callEnded');
    });
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
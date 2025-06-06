const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Store connected users
const connectedUsers = new Map();
const chatHistory = [];

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('join', (userData) => {
    const user = {
      id: socket.id,
      username: userData.username,
      joinedAt: new Date()
    };
    
    connectedUsers.set(socket.id, user);
    
    // Send chat history to newly joined user
    socket.emit('chat-history', chatHistory);
    
    // Broadcast user joined message
    const joinMessage = {
      id: Date.now(),
      type: 'system',
      message: `${user.username} joined the chat`,
      timestamp: new Date(),
      username: 'System'
    };
    
    chatHistory.push(joinMessage);
    io.emit('message', joinMessage);
    
    // Send updated user list
    io.emit('users-update', Array.from(connectedUsers.values()));
    
    console.log(`${user.username} joined the chat`);
  });

  // Handle chat messages
  socket.on('message', (messageData) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const message = {
        id: Date.now(),
        type: 'user',
        message: messageData.message,
        timestamp: new Date(),
        username: user.username,
        userId: socket.id
      };
      
      chatHistory.push(message);
      
      // Keep only last 100 messages
      if (chatHistory.length > 100) {
        chatHistory.shift();
      }
      
      // Broadcast message to all connected clients
      io.emit('message', message);
      
      console.log(`Message from ${user.username}: ${message.message}`);
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      socket.broadcast.emit('user-typing', {
        username: user.username,
        isTyping: data.isTyping
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      connectedUsers.delete(socket.id);
      
      // Broadcast user left message
      const leaveMessage = {
        id: Date.now(),
        type: 'system',
        message: `${user.username} left the chat`,
        timestamp: new Date(),
        username: 'System'
      };
      
      chatHistory.push(leaveMessage);
      io.emit('message', leaveMessage);
      
      // Send updated user list
      io.emit('users-update', Array.from(connectedUsers.values()));
      
      console.log(`${user.username} left the chat`);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    connectedUsers: connectedUsers.size,
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});

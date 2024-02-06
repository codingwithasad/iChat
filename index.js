const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
// Set up view engine and static files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// Define route for the root path
app.get('/', (req, res) => {
    res.render('index');
});
// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('a user connected');

    // Broadcast to all connected sockets except the current one
   socket.on('new-user-joined',name=>{
       console.log(name);
       socket.broadcast.emit('user joined', name + " joined the chat");
    })

    // Handle chat messages
    socket.on('chat message', (msg) => {
        // Emit the message with the 'sender' attribute
        io.emit('chat message', { message: msg, sender: socket.id });
        });
        
       
    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

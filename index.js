const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const app = express()
const formatMessage = require("./utils/message");
const {userJoin,getCurrentUser, userLeave, getRoomUsers} = require("./utils/users");

const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname,'public')))

io.on('connection', socket =>{

    socket.on("joinRoom", ({username,room}) => {
      const user = userJoin (socket.id,username,room)

      socket.join(user.room)
      
      socket.emit('message', formatMessage("chat App",'welcome'))

      socket.to(user.room).emit('message', 
        formatMessage("chat App", `${user.username} has joined`)
      )

      io.to(user.room).emit('roomUsers',getRoomUsers(user.room))
    });

    socket.on('chatMessage',(msg) => {
      const user = getCurrentUser(socket.id)
      io.to(user.room).emit("message", formatMessage(user.username, msg));
      
    })

    socket.on('disconnect', () => {
      const user = userLeave(socket.id)

      if (user){
        io.to(user.room).emit('message', formatMessage('chatApp',`${user.username} has left the chat`))
        io.to(user.room).emit("roomUsers", getRoomUsers(user.room));
      }

    })

    

    
})










const PORT = 3000 || process.env.PORT

server.listen(PORT,() => console.log(`Listening on port ${PORT}`))
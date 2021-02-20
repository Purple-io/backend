import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config.js';
import morgan from 'morgan';
import { createServer } from 'http';
import * as io from "socket.io"
import registerRouter from './src/routes/register.js';
import loginRouter from './src/routes/login.js';
import matchRouter from './src/routes/match.js';
import chatRouter from './src/routes/chatRoutes.js';

import { sendMessage } from './src/socket/chatSocket.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

const database = process.env.DATABASE_URI;
mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log(err));

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/match', matchRouter);
app.use('/chat', chatRouter);



const server = createServer(app); 
const socketio = new io.Server(server);

socketio.on("connection", (socket)=>{
  console.log("user connected");
  socket.on("disconnect", ()=>{
    console.log("Disconnected")
})
});

socketio.on("sendMessage", (data) => {
  sendMessage(data, socket);
});

// socketio.on("deleteMessage", (data) => {
//   deleteMessage(data, socket);
// });

server.listen(port, () => {
  console.log(`SERVER Server is running on port: ${port}`);
});

const express = require("express");
const cors = require("cors");

const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const port = 5000;

const authUser = require('./router/auth');
const UserRouter = require('./router/user');
const SellerRouter = require('./router/Seller');

const ProductRouter = require('./router/Products');
const OrderRouter = require("./router/order");
const MainRouter = require("./router/mainAdmin");
const message = require("../Backend/router/message")
const Influencer = require("./router/Influencer");
const Influencerbank = require("./router/Influencerbankaccount");
const bank = require("./router/bankaccount");
const Transfer = require("./router/Transfermoney");
const PostRouter = require("./router/Post");
const Chat = require("../Backend/router/Groupchat")
const { Server } = require("socket.io");
const {createServer} = require("http");
const InfluencerTransaction = require("./router/InfluencerTransaction");
dotenv.config(); /// (dotenv allows you to separate secrets from your source code. This is useful in a collaborative environment (e.g., work, or open source) where you may not want to share your database login credentials with other people. Instead, you can share the source code while allowing other people to create their own .env file.)

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("DB connected successfully")).catch((error)=>{
    console.log(error)
})

app.use(cors()); // (Cross-origin Resource sharing ) It can transmitting HTTP header 
app.use(express.json());

app.use("/api/auth" , authUser);
app.use("/api/user" , UserRouter);
app.use("/api/seller" , SellerRouter);
app.use("/api/post" , PostRouter);

app.use("/api/chat" , Chat);
app.use("/api/message" , message )
app.use("/api/products" , ProductRouter);
app.use("/api/order" , OrderRouter);
app.use("/api/main" , MainRouter);

app.use("/api/influencer" , Influencer);
app.use("/api/influencer/bank" , Influencerbank);
app.use("/api/bankaccout" , bank);
app.use("/api/transfer" , Transfer);
app.use("/api/influencer/transaction" , InfluencerTransaction);

const server = createServer(app);
const io = new Server(server , {
    pingTimeout:6000,
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection" , (socket)=>{
    socket.on('setup' , (userData)=>{
        socket.join(userData._id);
        socket.emit("Connected")
    })
    socket.on('join chat' , (room)=>{
        socket.join(room);
        socket.emit("Connected")
    })


    socket.on('new message' , (newMessageReceived)=>{
        const chat = newMessageReceived.group;
        if(!chat.users) return console.log("Chat users not defined");

        chat.users.forEach((user)=>{
            if(user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("Message received" , newMessageReceived);
        });
    });

    socket.off("setup", () => {
        socket.leave(userData._id);
      });

    socket.off('join chat' , (room)=>{
        socket.leave(room);
    })
})



server.listen(port , ()=>{
    console.log(`Server is running at http://localhost:${port}`)
})
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors')

/* Routes */
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require("./routes/chat.routes");
const messageRoutes = require('./routes/message.routes')


const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


/* using middlewares */
app.use(express.json());
app.use(cookieParser());



/* Using Routes */
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages',messageRoutes);

module.exports = app;
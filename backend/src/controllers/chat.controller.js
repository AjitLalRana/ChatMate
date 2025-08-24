const chatModel = require('../models/chat.model');

//protected route
async function createChat(req, res) {

    const { title } = req.body;
    const user = req.user;

    const chat = await chatModel.create({
        userId: user._id,
        title
    });

    res.status(201).json({
        message: "Chat created successfully",
        chat: {
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            userId: chat.userId
        }
    });

}

async function userChat(req,res){
    const user = req.user;
    const userChats =(await chatModel.find({userId : user._id}).sort({ createdAt: -1 }).lean())
    
    res.json({
        message: "Chat fetched successfully",
        userChats
    })
}

module.exports = {
    createChat,
    userChat
};
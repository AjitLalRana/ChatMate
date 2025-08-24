const messageModel = require("../models/message.model")


const getMessages = async(req,res)=>{
    const chatId = req.params.chatId;
    const userId = req.user._id;

    const userchatMessages =await messageModel.find({chatId,userId});
    res.json({
        message: "messages fetched successfully",
        messages : userchatMessages
    })
}

module.exports = {
    getMessages
}
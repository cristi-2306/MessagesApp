const asyncHandler = require("express-async-handler");
const Message = require('../models/messageModel');

const sendMessage = asyncHandler(async (req, res) => {
  console.log('Received request:', req.body);
  console.log('Received files:', req.files);
  const { content, chatId } = req.body;
  
  const voiceMessage = req.files && req.files['voiceMessage'] ? req.files['voiceMessage'][0].buffer : null;
  const pictureMessage = req.files && req.files['pictureMessage'] ? req.files['pictureMessage'][0].buffer : null;
  const videoMessage = req.files && req.files['videoMessage'] ? req.files['videoMessage'][0].buffer : null;
  
  console.log('Content:', content);
  console.log('Chat ID:', chatId);
  console.log('Voice Message:', voiceMessage);
  console.log('Picture Message:', pictureMessage);
  console.log('Video Message:', videoMessage);
  
  if (!chatId) {
    console.log('Chat ID is required');
    return res.sendStatus(400);
  }

  if (!content && !voiceMessage && !pictureMessage && !videoMessage) {
    console.log('Invalid data passed into request');
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    content: content || null,
    voiceMessage: voiceMessage || null,
    pictureMessage: pictureMessage || null,
    videoMessage: videoMessage || null,
    chat: chatId,
  };

  try {
    const message = await Message.create(newMessage);
    res.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
      
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(400);
    throw new Error(error.message);
  }
});

const handleFileUpload = asyncHandler(async (req, res) => {
  const fileBuffer = req.file.buffer;

  try {
    const newFile = new FileModel({ data: fileBuffer });
    await newFile.save();

    res.send('File uploaded successfully');
  } catch (error) {
    console.error('Error saving file to database:', error);
    res.status(500).send('Internal Server Error');
  }
});

const shareLocation = asyncHandler(async (req, res) => {
  const { chatId, latitude, longitude } = req.body;
console.log("request body", req.body)
  if (!chatId || latitude === undefined || longitude === undefined) {
    return res.status(400).send('Chat ID and location (latitude and longitude) are required');
  }

  const newMessage = {
    sender: req.user._id,
    chat: chatId,
    locationMessage: {
      latitude,
      longitude
    }
  };

  try {
    const message = await Message.create(newMessage);
    res.json(message);
  } catch (error) {
    console.error('Error sharing location:', error);
    res.status(400).send(error.message);
  }
});

module.exports = { sendMessage, allMessages, handleFileUpload, shareLocation };
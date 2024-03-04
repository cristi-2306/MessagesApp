const mongoose = require('mongoose');

const messageModel = mongoose.Schema(
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      content: { type: String, trim: true },
      voiceMessage: { type: Buffer },
      pictureMessage: {type: Buffer},
      videoMessage: {type: Buffer},
      chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
      locationMessage: {
        latitude: { type: Number },
        longitude: { type: Number }
      },
    },
    {
      timestamps: true,
    }
  );
  
  const Message = mongoose.model('Message', messageModel);
  
  module.exports = Message;
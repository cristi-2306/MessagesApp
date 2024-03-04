const mongoose = require('mongoose');

const fileSchema = mongoose.Schema(
  {
    data: { type: Buffer },
  },
  {
    timestamps: true,
  }
);

const FileModel = mongoose.model('FileModel', fileSchema);

module.exports = FileModel;
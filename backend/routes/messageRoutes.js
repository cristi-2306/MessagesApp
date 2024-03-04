const express = require('express');
const { sendMessage, allMessages, handleFileUpload, shareLocation } = require('../controllers/messageControllers');
const { protect } = require('../middlewares/authMidlleware');
const multer = require('multer');  

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
console.log(upload);
const router = express.Router();

router.route('/').post(protect, upload.fields([{ name: 'voiceMessage', maxCount: 1 }, { name: 'pictureMessage', maxCount: 1 }, { name: 'videoMessage', maxCount: 1 }]), sendMessage);
router.post('/upload', upload.single('file'), handleFileUpload);
router.route('/:chatId').get(protect, allMessages);
router.post('/share-location', protect, shareLocation);


module.exports = router;
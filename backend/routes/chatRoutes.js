const express = require("express");
const { protect } = require("../middlewares/authMidlleware");

const router = express.Router();




const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");




router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, (req, res) => renameGroup(req, res));
router.route("/groupremove").put(protect, (req, res) => removeFromGroup(req, res));
router.route("/groupadd").put(protect, (req, res) => addToGroup(req, res));

module.exports = router;
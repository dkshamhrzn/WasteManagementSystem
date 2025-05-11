const express = require("express");
const upload = require("../utils/upload"); // Path to your multer config
const User = require("../models/UserDetailsSchema");

const router = express.Router();

router.post("/upload-profile", upload.single("profile"), async (req, res) => {
  try {
    const userId = req.body.userId;
    const profilePictureUrl = req.file.path;

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: profilePictureUrl },
      { new: true }
    );

    res.json({ message: "Profile picture updated", user });
  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

module.exports = router;

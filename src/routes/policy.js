const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Policy = require("../models/Policy");
require("../models/Account");
require("../models/Lob");
require("../models/Carrier");

// Search all policies by username
router.get("/policies", async (req, res, next) => {
  try {
    const username = req.query?.username;
    if (!username) {
      return res
        .status(400)
        .json({ error: "Username query parameter required" });
    }

    const user = await User.findOne({
      firstName: { $regex: new RegExp(`^${username}$`, "i") },
    });

    // const user = await User.findOne({ firstName: username });

    if (!user) return res.status(404).json({ error: "User not found" });
    const policies = await Policy.find({ userId: user._id })
      .populate("userId")
      .populate("accountId")
      .populate("lobId")
      .populate("carrierId")
      .exec();
    res.json(policies);
  } catch (err) {
    next(err);
  }
});

// Fetch policy by ID, with full populated details
router.get("/policies/:policyId", async (req, res, next) => {
  try {
    const policy = await Policy.findById(req.params.policyId)
      .populate("userId accountId lobId carrierId")
      .exec();
    if (!policy) return res.status(404).json({ error: "Policy not found" });
    res.json(policy);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

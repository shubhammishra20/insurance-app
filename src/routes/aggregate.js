const express = require("express");
const router = express.Router();
const Policy = require("../models/Policy");

router.get("/aggregate/user-policies", async (req, res, next) => {
  try {
    const data = await Policy.aggregate([
      { $group: { _id: "$userId", policyCount: { $sum: 1 } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          username: "$user.firstName",
          email: "$user.email",
          policyCount: 1,
        },
      },
    ]);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

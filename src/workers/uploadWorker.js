const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");
const csv = require("csvtojson");
const xlsx = require("xlsx");
require("../utils/db");

const Agent = require("../models/Agent");
const User = require("../models/User");
const Account = require("../models/Account");
const Lob = require("../models/Lob");
const Carrier = require("../models/Carrier");
const Policy = require("../models/Policy");

async function parseFile(filePath) {
  const ext = filePath.split(".").pop().toLowerCase();
  if (ext === "csv") return csv().fromFile(filePath);
  if (["xls", "xlsx"].includes(ext)) {
    const wb = xlsx.readFile(filePath);
    return xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  }
  throw new Error("Unsupported file type");
}

async function run() {
  try {
    const rows = await parseFile(workerData.filePath);
    let insertedCount = 0;

    for (const row of rows) {
      // Handle Agent (Create if not exists)
      const agent = await Agent.findOneAndUpdate(
        { name: row.agent },
        { name: row.agent },
        { upsert: true, new: true }
      );

      // Handle User (Email as unique)
      const existingUser = await User.findOne({ email: row.email });
      let user;
      if (!existingUser) {
        user = await User.create({
          firstName: row.firstname,
          dob: new Date(row.dob),
          address: row.address,
          phone: row.phone,
          state: row.state,
          zip: row.zip,
          email: row.email,
          gender: row.gender,
          userType: row.userType,
        });
      } else {
        user = existingUser;
      }

      // Handle Account
      const account = await Account.findOneAndUpdate(
        { name: row.account_name, userId: user._id },
        { name: row.account_name, userId: user._id },
        { upsert: true, new: true }
      );

      // Handle LOB
      const lob = await Lob.findOneAndUpdate(
        { name: row.category_name },
        { name: row.category_name },
        { upsert: true, new: true }
      );

      // Handle Carrier
      const carrier = await Carrier.findOneAndUpdate(
        { name: row.company_name },
        { name: row.company_name },
        { upsert: true, new: true }
      );

      // Handle Policy
      const existingPolicy = await Policy.findOne({
        policyNumber: row.policy_number,
      });
      if (!existingPolicy) {
        await Policy.create({
          policy_number: row.policy_number,
          policy_mode: row.policy_mode,
          policy_type: row.policy_type,
          producer: row.producer,
          premium_amount: parseFloat(row.premium_amount) || 0,
          premium_amount_written: parseFloat(row.premium_amount_written) || 0,
          policy_start_date: new Date(row.policy_start_date),
          policy_end_date: new Date(row.policy_end_date),
          userId: user._id,
          accountId: account._id,
          lobId: lob._id,
          carrierId: carrier._id,
        });
        insertedCount++;
      }
    }

    fs.unlinkSync(workerData.filePath); // Clean up
    parentPort.postMessage(insertedCount);
  } catch (err) {
    parentPort.postMessage({ error: err.message });
  }
}

run();

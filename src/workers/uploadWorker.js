const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const csv = require('csvtojson');
const xlsx = require('xlsx');
require('../utils/db'); // ensure DB connection

const Agent = require('../models/Agent');
const User = require('../models/User');
const Account = require('../models/Account');
const Lob = require('../models/Lob');
const Carrier = require('../models/Carrier');
const Policy = require('../models/Policy');

async function parseFile(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  if (ext === 'csv') return csv().fromFile(filePath);
  if (['xls','xlsx'].includes(ext)) {
    const wb = xlsx.readFile(filePath);
    return xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  }
  throw new Error('Unsupported file type');
}

async function run() {
  try {
    const rows = await parseFile(workerData.filePath);
    for (const row of rows) {
      const agent = await Agent.create({ name: row.agentName });
      const user = await User.create({
        firstName: row.userFirstName,
        dob: new Date(row.dob),
        address: row.address,
        phone: row.phone,
        state: row.state,
        zip: row.zip,
        email: row.email,
        gender: row.gender,
        userType: row.userType
      });
      const account = await Account.create({ name: row.accountName, userId: user._id });
      const lob = await Lob.create({ name: row.categoryName });
      const carrier = await Carrier.create({ name: row.companyName });
      await Policy.create({
        policyNumber: row.policyNumber,
        startDate: new Date(row.startDate),
        endDate: new Date(row.endDate),
        userId: user._id,
        accountId: account._id,
        lobId: lob._id,
        carrierId: carrier._id
      });
    }
    fs.unlinkSync(workerData.filePath);
    parentPort.postMessage(rows.length);
  } catch (err) {
    parentPort.postMessage({ error: err.message });
  }
}

run();

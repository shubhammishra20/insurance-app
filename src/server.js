const express = require("express");

require("dotenv").config();

require("./utils/db");

const uploadRoute = require("./routes/upload");
const policyRoute = require("./routes/policy");
const aggregateRoute = require("./routes/aggregate");

const app = express();
app.use(express.json());

app.use("/api", uploadRoute);
app.use("/api", policyRoute);
app.use("/api", aggregateRoute);

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

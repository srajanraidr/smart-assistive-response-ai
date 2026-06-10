const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.routes');
const departmentRoutes = require('./routes/department.routes');
const incidentRoutes = require('./routes/incident.routes');
const authenticate = require('./middleware/auth.middleware');
const aiRoutes = require("./routes/ai.routes");


const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/departments',authenticate,departmentRoutes);
app.use("/api/ai", aiRoutes);
app.use('/api/incidents',authenticate,incidentRoutes);
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "SARA API",
    version: "1.0.0",
  });
});
module.exports = app;
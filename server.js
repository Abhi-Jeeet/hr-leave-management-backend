const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/auth");
const leaveRoutes = require("./src/routes/leaves");
const { errorHandler, notFound } = require('./src/middleware/error');



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Service Started");
    app.listen(PORT,()=>console.log(`Service is running on Port ${PORT}`)
    )
    
})

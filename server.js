const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require("mongoose");



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Service Started");
    app.listen(PORT,()=>console.log(`Service is running on Port ${PORT}`)
    )
    
})

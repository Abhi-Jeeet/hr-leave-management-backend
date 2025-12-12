const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const YAML = require('yamljs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require("./src/routes/auth");
const leaveRoutes = require("./src/routes/leaves");
const { errorHandler, notFound } = require('./src/middleware/error');



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Swagger API Documentation
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => res.json({ ok: true, service: 'HR Leave API', docs: '/api-docs' }));

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

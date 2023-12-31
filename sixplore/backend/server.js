const express = require('express');
const authRoutes = require('../routes/AuthRoutes');
const exploreRoutes = require('../routes/ExploreRoutes');
const userRoutes = require('../routes/UserRoutes');
const adminRoutes = require('../routes/AdminRoutes');
const db = require('../backend/database')
const cors = require('cors')

const PORT = process.env.PORT || 5000;

const app = express();


app.use(cors());

app.use(express.json());

app.use('/', authRoutes, exploreRoutes, userRoutes, adminRoutes);

app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
    try {
        db.init();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});
require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./db');

connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`API corriendo en el puerto ${PORT}`);
});
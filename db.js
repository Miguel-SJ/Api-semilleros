const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.log('Error al conectar a atlas:', error);
    }
};

module.exports = { connectDB };
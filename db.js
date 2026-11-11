import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a la base de datos en Atlas');
    } catch (error) {
        console.log('Error al conectar a Atlas:', error);
    }
};
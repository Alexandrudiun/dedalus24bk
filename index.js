const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Configurare Express
const app = express();
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Conexiune la MongoDB
const uri = 'mongodb+srv://alex:alex@cluster0.x2rho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0e';

mongoose.connect(uri)
    .then(() => console.log('Conexiune reușită la MongoDB'))
    .catch(err => console.error('Eroare la conectare:', err));

// Schema pentru obiect
const ObjectSchema = new mongoose.Schema({
    startx: Number,
    starty: Number,
    sizex: Number,
    sizey: Number, 
    endx: Number,
    endy: Number,
    wallarray: String,
    Density: Number,
});

// Modelul Mongoose
const ObjectModel = mongoose.model('Object', ObjectSchema);

// Ruta pentru înregistrare
app.post('/create', async (req, res) => {
    const { startx, starty, sizex, sizey, endx, endy, wallarray, Density } = req.body;
    
    const newObject = new ObjectModel({
       startx,
       starty,
       sizex,
       sizey,
       endx,
       endy,
       wallarray,
       Density,
});
    
    try {
        const savedObject = await newObject.save();
        
        // Răspuns personalizat cu ID-ul obiectului salvat
        res.status(201).json({
            message: 'successfully',
            id: savedObject._id, 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/get/:id', async (req, res) => {
    try {
        const object = await ObjectModel.findById(req.params.id);
        if (!object) return res.status(404).send('Obiectul nu a fost găsit');
        res.json(object);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta pentru a obține toate obiectele
app.get('/getall', async (req, res) => {
    try {
        const objects = await ObjectModel.find();
        res.json(objects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Pornirea serverului
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serverul rulează pe portul ${PORT}`);
});

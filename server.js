
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();


app.use(bodyParser.urlencoded({ extended: true }));  
app.use(methodOverride('_method')); 
app.set('view engine', 'ejs');  


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});


const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  color: { type: String, required: true },
  price: { type: Number },
  description: { type: String },
  image: { type: String }
});

const Car = mongoose.model('Car', carSchema);


app.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find();  
    res.render('index', { cars });  
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving cars');
  }
});


app.get('/cars/new', (req, res) => {
  res.render('new');  
});


app.post('/cars', async (req, res) => {
  const { make, model, year, color, price, description, image } = req.body;
  try {
    const newCar = new Car({
      make,
      model,
      year,
      color,
      price,
      description,
      image
    });
    await newCar.save(); 
    res.redirect('/cars');  
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving the car');
  }
});


app.get('/cars/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findById(id);  
    if (!car) {
      return res.status(404).send('Car not found');
    }
    res.render('show', { car });  
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving the car');
  }
});


app.get('/cars/:id/edit', async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findById(id); 
    if (!car) {
      return res.status(404).send('Car not found');
    }
    res.render('edit', { car }); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving the car');
  }
});


app.put('/cars/:id', async (req, res) => {
  const { id } = req.params;
  const { make, model, year, color, price, description, image } = req.body;
  try {
    const updatedCar = await Car.findByIdAndUpdate(id, {
      make,
      model,
      year,
      color,
      price,
      description,
      image
    }, { new: true });  
    res.redirect(`/cars/${id}`);  
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating the car');
  }
});


app.delete('/cars/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Car.findByIdAndDelete(id);  
    res.redirect('/cars');  
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting the car');
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

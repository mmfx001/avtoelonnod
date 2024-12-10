const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// App initialization
const app = express();
const PORT = process.env.PORT || 5070;

// MongoDB connection URL
const dbURI = "mongodb+srv://dilbekshermatov:dilbek1233@cluster0.ed9xx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define Mongoose schemas for collections

// Users schema
const userSchema = new mongoose.Schema({
  nomer: String,
  parol: String,
  hisob: Number,
  likeItems: [String]
});
const User = mongoose.model("User", userSchema);

// Yengilavtomobil schema
const yengilavtomobilSchema = new mongoose.Schema({
  marka: String,
  userid: String,
  dvigatel: String,
  qutisi: String,
  texnikaturi: String,
  kraska: String,
  rang: String,
  yoqilgi: String,
  holati: String,
  kuzov: String,
  uzatma: String,
  shahar: String,
  kamibor: String,
  raqam: String,
  tafsilot: String,
  narx: String,
  img1: String,
  img2: String,
  img3: String,
  img4: String,
  img5: String,
  img6: String,
  likecount: Number,
  vaqt: String,
  yili: String,
  viewcount: Number,
  budjet: String
});
const Yengilavtomobil = mongoose.model("Yengilavtomobil", yengilavtomobilSchema);

// Maxsustexnika schema
const maxsustexnikaSchema = new mongoose.Schema({
  marka: String,
  userid: String,
  holati: String,
  dvigatel: String,
  qutisi: String,
  texnikaturi: String,
  kraska: String,
  rang: String,
  yoqilgi: String,
  kuzov: String,
  uzatma: String,
  shahar: String,
  kamibor: String,
  raqam: String,
  tafsilot: String,
  narx: String,
  img1: String,
  img2: String,
  img3: String,
  img4: String,
  img5: String,
  img6: String,
  likecount: Number,
  vaqt: String,
  yili: String,
  viewcount: Number,
  budjet: String
});
const Maxsustexnika = mongoose.model("Maxsustexnika", maxsustexnikaSchema);

// Ehtiyotqisimlar schema
const ehtiyotqisimlarSchema = new mongoose.Schema({
  modeluchun: String,
  userid: String,
  kraska: String,
  holati: String,
  qismturi: String,
  yetkazish: String,
  rang: String,
  shahar: String,
  raqam: String,
  tafsilot: String,
  narx: String,
  img1: String,
  img2: String,
  img3: String,
  img4: String,
  img5: String,
  img6: String,
  likecount: Number,
  vaqt: String,
  yili: String,
  viewcount: Number,
  budjet: String
});
const Ehtiyotqisimlar = mongoose.model("Ehtiyotqisimlar", ehtiyotqisimlarSchema);

// Tamirlashturi schema
const tamirlashturiSchema = new mongoose.Schema({
  userid: String,
  raqam: String,
  remontturi: String,
  elonnomi: String,
  tafsilot: String,
  shahar: String,
  kamibor: String,
  tajriba: String
});
const Tamirlashturi = mongoose.model("Tamirlashturi", tamirlashturiSchema);

// Tolovlar schema
const tolovlarSchema = new mongoose.Schema({
  summa: String,
  user: String,
  status: String,
  vaqt: String,
  chekimg: String
});
const Tolovlar = mongoose.model("Tolovlar", tolovlarSchema);

// CRUD route generator
const createCRUDRoutes = (model, modelName) => {
  const router = express.Router();

  // GET All items
  router.get('/', async (req, res) => {
    try {
      const items = await model.find();
      res.json(items);
    } catch (err) {
      console.error(`GET /${modelName.toLowerCase()} error:`, err.message);
      res.status(500).json({ message: err.message });
    }
  });

  // GET Single item by ID
  router.get('/:_id', getItem(model, modelName), (req, res) => {
    res.json(res.item);
  });

  // POST New item
  router.post('/', async (req, res) => {
    const item = new model(req.body);
    try {
      const newItem = await item.save();
      res.status(201).json(newItem);
    } catch (err) {
      console.error(`POST /${modelName.toLowerCase()} error:`, err.message);
      res.status(400).json({ message: err.message });
    }
  });

  // PUT Update item by ID
  router.put('/:_id', getItem(model, modelName), async (req, res) => {
    Object.assign(res.item, req.body);
    try {
      const updatedItem = await res.item.save();
      res.json(updatedItem);
    } catch (err) {
      console.error(`PUT /${modelName.toLowerCase()}/${req.params._id} error:`, err.message);
      res.status(400).json({ message: err.message });
    }
  });

  // DELETE Item by ID
  router.delete('/:_id', getItem(model, modelName), async (req, res) => {
    try {
      await res.item.remove();
      res.json({ message: `${modelName} deleted` });
    } catch (err) {
      console.error(`DELETE /${modelName.toLowerCase()}/${req.params._id} error:`, err.message);
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};

// Middleware: Fetch an item by ID
function getItem(model, modelName) {
  return async (req, res, next) => {
    let item;
    try {
      item = await model.findById(req.params._id);  // Use _id instead of id
      if (item == null) {
        return res.status(404).json({ message: `${modelName} not found` });
      }
    } catch (err) {
      console.error(`GET_ITEM /${modelName.toLowerCase()}/${req.params._id} error:`, err.message);
      return res.status(500).json({ message: err.message });
    }

    res.item = item;
    next();
  };
}

// Use CRUD routes for each model
app.use('/users', createCRUDRoutes(User, 'User'));
app.use('/yengilavtomobil', createCRUDRoutes(Yengilavtomobil, 'Yengilavtomobil'));
app.use('/maxsustexnika', createCRUDRoutes(Maxsustexnika, 'Maxsustexnika'));
app.use('/ehtiyotqisimlar', createCRUDRoutes(Ehtiyotqisimlar, 'Ehtiyotqisimlar'));
app.use('/tamirlashturi', createCRUDRoutes(Tamirlashturi, 'Tamirlashturi'));
app.use('/tolovlar', createCRUDRoutes(Tolovlar, 'Tolovlar'));

// MongoDB connection and server startup
const startServer = async () => {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

startServer();

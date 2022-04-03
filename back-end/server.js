const express = require('express');
const bodyParser = require("body-parser");

// Configure multer so that it will upload to '../front-end/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/cast', {
  useNewUrlParser: true
});

const itemSchema = new mongoose.Schema({
  name: String,
  charactername: String,
  path: String,
});

const Item = mongoose.model('Item', itemSchema);

const castSchema = new mongoose.Schema({
  moviename: String,
  castmembers: [itemSchema],
});

const Castlist = mongoose.model('Castlist', castSchema);

//api calls go here
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  if(!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

app.post('/api/items', async(req, res) => {
  const item = new Item({
    name: req.body.name,
    charactername: "",
    path: req.body.path,
  });
  try {
    await item.save();
    res.send(item);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/castlists', async(req, res) => {
  const castlist = new Castlist({
    moviename: req.body.name,
    castmembers: [],
  });
  try {
    await castlist.save();
    res.send(castlist);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/casting', async(req, res) => {
  let casting = new Item({
    name: req.body.actorname,
    charactername: req.body.charactername,
    path: req.body.actorpath,
  });
  // console.log(casting);
  try {
    await Castlist.updateOne({moviename:req.body.moviename}, 
      {$push:{"castmembers":casting}})
    let castResult = await Castlist.findOne({moviename:req.body.moviename});
    res.send(castResult);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/items', async(req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/castlists', async(req, res) => {
  try {
    let castlists = await Castlist.find();
    res.send(castlists);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//delete an item
app.delete("/api/items/:id", async (req, res) => {
  try {
    await Item.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//edit an item
app.put("/api/items/:id", async (req, res) => {
  console.log("in in the server");
  try {
    let item = await Item.findOne({
      _id: req.params.id
    });
    console.log(item);
    item.name = req.body.name;
    item.save();
    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3030, () => console.log('Server listening on port 3030!'));
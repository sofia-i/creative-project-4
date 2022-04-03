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
  path: String,
  age: Number,
  height: String,
  nationality: String,
});

const Item = mongoose.model('Item', itemSchema);

const castSchema = new mongoose.Schema({
  moviename: String,
  castmembers: [itemSchema],
  roles: [String],
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
    path: req.body.path,
    age: req.body.age,
    height: req.body.height,
    nationality: req.body.nationality,
  });
  try {
    await item.save();
    res.send(item);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/cast', async(req, res) => {
  const castlist = new Castlist({
    moviename: req.body.name,
    castmembers: [],
    roles: [],
  });
  try {
    await castlist.save();
    res.send(castlist);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//create a new casting
app.post('/api/casting', async(req, res) => {
  let casting = new Item({
    name: req.body.actorname,
    path: req.body.actorpath,
  });
  try {
    await Castlist.updateOne({moviename:req.body.moviename}, 
      {$push:{"castmembers":casting}})
    await Castlist.updateOne({moviename:req.body.moviename}, 
      {$push:{"roles":req.body.charactername}})
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

app.get('/api/cast', async(req, res) => {
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

//delete a cast
app.delete("/api/cast/:id", async (req, res) => {
  try {
    await Castlist.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//delete a casting
app.delete("/api/casting/:id", async(req, res) => {
  try {
    let castlistBefore = await Castlist.findOne({_id:req.params.id});

    await Castlist.updateOne({_id:req.params.id}, 
      {$pull:{castmembers: {name : req.body.actorname}}})
    await Castlist.updateOne({_id:req.params.id}, 
      {$pull:{roles: req.body.charactername}})

    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//edit an item
app.put("/api/items/:id", async (req, res) => {
  try {
    let item = await Item.findOne({
      _id: req.params.id
    });
    item.name = req.body.name;
    item.age = req.body.age;
    item.nationality = req.body.nationality;
    item.height = req.body.height;
    item.save();
    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//edit a cast
app.put("/api/cast/:id", async (req, res) => {
  try {
    let cast = await Castlist.findOne({
      _id: req.params.id
    });
    cast.moviename = req.body.moviename;
    cast.save();
    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3030, () => console.log('Server listening on port 3030!'));
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');

//models
const listing = require('./DB_model/listing.js');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate)
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
    .then(()=>console.log('DB connection successful'))
    .catch((err)=>console.log(err));


app.get("/listings", async (req, res)=>{
    const list = await listing.find({});
    res.render('listing', {list});
    // renderer('listing', {list}, res);
});

app.get("/listings/new", async (req, res)=>{
    res.render('new', {});
});
app.post('/listings/', async (req, res)=>{
    let newProperty = req.body;
    let temp = new listing({
        title: newProperty.title,
        description: newProperty.description,
        image: newProperty.image,
        price: newProperty.price,
        location: newProperty.location,
        country: newProperty.country,
    });
    await temp.save(); 
    console.log(temp);
    res.redirect('/listings');
});
app.delete('/listings/:id', async (req, res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete({_id: id});
    res.redirect('/listings');
});
app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    const listed = await listing.findById(id);
    res.render('edit', {listed});
});
app.put("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, req.body, {returnDocument: 'after'});
    res.redirect(`/listings/${id}`);
});
app.get("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    const listed = await listing.findById(id);
    res.render('show', {listed});
});




app.listen(8080, ()=>{console.log('Sever is running on port: 8080')});
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');

//models
const listing = require('./DB_model/listing.js');
const { render } = require('ejs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
    .then(()=>console.log('DB connection successful'))
    .catch((err)=>console.log(err));

function renderer(page, data, res){
    res.render(page, data, (err, html)=>{
        if(err) return res.status(500).send(err.message);
        res.render('index',{body: html});
    });
}

app.get("/listings", async (req, res)=>{
    const list = await listing.find({});
    renderer('listing', {list}, res);
});

app.get("/listings/new", async (req, res)=>{
    renderer('new', {}, res);
});
app.post('/listings/create', async (req, res)=>{
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
app.delete('/listings/:id/delete', async (req, res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete({_id: id});
    res.redirect('/listings');
});
app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    const listed = await listing.findById(id);
    renderer('edit', {listed}, res);
    // res.send('Edit route');
});
app.put("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, req.body, {returnDocument: 'after'});
    res.redirect(`/listings/${id}`);
});
app.get("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    const listed = await listing.findById(id);
    renderer('show', {listed}, res);
});




app.listen(8080, ()=>{console.log('Sever is running on port: 8080')});
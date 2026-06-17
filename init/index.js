import mongoose from 'mongoose';
import initData from './data.js';
import {Listing as listing} from '../DB_model/listing.js';
import { reviews } from '../DB_model/reviews.js';
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
    .then(()=>console.log('DB connection successful'))
    .catch((err)=>console.log(err));

async function initDB() {
    await listing.deleteMany({});
    await reviews.deleteMany({});

    await listing.insertMany(initData);
    console.log("Data inserted successfully");
}

initDB();
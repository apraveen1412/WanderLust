import mongoose from 'mongoose';
import initData from './data.js';
import {Listing as listing} from '../models/listing.js';
import { reviews } from '../models/reviews.js';
import {user} from '../models/user.js'
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
    .then(()=>console.log('DB connection successful'))
    .catch((err)=>console.log(err));

async function initDB() {
    await listing.deleteMany({});
    // await reviews.deleteMany({});
    // await user.deleteMany({});

    const updatedData = initData.map((obj)=>({...obj, owner: '6a57e26459f16698b2f2d766'}));
    await listing.insertMany(updatedData);
    console.log("Data inserted successfully");
}

initDB();
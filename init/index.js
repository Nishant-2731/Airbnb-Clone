const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/Listing.js");

main()
.then(()=>
{
    console.log("Connection Successful");
})
.catch(err => console.log(err));

async function main() 
{
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");    
}

const initDB = async()=>
{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: '674fd919e5bb980f7f9ed6c6'}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();
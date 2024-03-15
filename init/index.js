const mongoose = require("mongoose"); 
const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("../models/listing.js");
const initData = require("./data.js");

main().then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB = async ()=>{
    await Listing.deleteMany({});
     initData.data = initData.data.map((obj)=>({
    ...obj , 
    owner:"65eca4762747bb0a08c3536f"
    }));
    await Listing.insertMany(initData.data);
    console.log("data is saved");
};
initDB();
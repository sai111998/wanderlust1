const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing");

const mongoose_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("coneected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoose_url);
}

const initDB=async()=>{
    await Listing.deleteMany({})
    initData.data=initData.data.map((obj)=>({...obj,owner:"682586881bbefdae814c96cb"}))
    await Listing.insertMany(initData.data);
    console.log("Data Added");
}

initDB();
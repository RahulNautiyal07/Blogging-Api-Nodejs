// let url = "mongodb+srv://rahulnautiyal:123@test@cluster0.neuer.mongodb.net/?retryWrites=true&w=majority";
const config = require("config");
const mongoose = require('mongoose');
const database = config.get("database");

mongoose
 .connect(database.url,{
  dbName:database.name,
  useNewUrlParser:true, 
  useUnifiedTopology:true,
 })
//  .then(()=>{
//   console.log('mongodb connected.')
// }).catch(err=>console.log(err.message))

mongoose.connection.on('connected',()=>{console.log('Mongoose connected to db')})

mongoose.connection.on('error', (err)=>{console.log(err.message)})

mongoose.connection.on('disconnected',()=>{console.log('Mongoose connection is disconnected')})

process.on('SIGINT', async () => {
 await mongoose.connection.close();
 process.exit(0);
})
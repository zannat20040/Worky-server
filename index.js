const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());
// app.use(cookieParser());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j7hulja.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // ALL DATABASE DECALERE

    const databse = client.db("Worky")
    const alljobs = databse.collection("jobCollection")
  
    // ALL POST HERT

    app.post('/addjobs', async(req,res)=>{
      try{
        const job = req.body
      const result = await alljobs.insertOne(job);
      res.send(result)
      }
      catch{
        console.log(req);
      }
    })

    // ALL GET HERE
    app.get('/addjobs', async(req,res)=>{
      const result = await alljobs.find().toArray();
      res.send(result)
    })

    app.get('/addjobs/:category', async(req,res)=>{
      const category = req.params.category
      const query = { category: category };
      const result = await alljobs.find(query).toArray();
      res.send(result)
    })

   


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
    console.log('get is working')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
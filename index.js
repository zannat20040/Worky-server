const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));
app.use(cookieParser());


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
    const allBids = databse.collection("bidsCollection")

    // ALL JWT

    app.post('/jwt', async (req, res) => {
      const body = req.body

      const token = jwt.sign(body, process.env.SECRET, { expiresIn: '10h' })
      const expireDate = new Date()
      expireDate.setDate(expireDate.getDate() + 7)

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        expires: expireDate
      }).send({ msg: "success" })

    })


    const verify = async (req, res, next) => {
      const token = req.cookies?.token
      if (!token) {
        res.status(401).send({ status: "Unauthorized Access", code: "401" })

        return;
      }
      jwt.verify(token, process.env.SECRET, (error, decode) => {
        if (error) {
          res.status(401).send({ status: "Unauthorized Access", code: "401" })
        }
        else {
          // console.log(decode)
          req.decode = decode
        }
      })
      next()
    }



    // ALL POST


    app.post('/addjobs', async (req, res) => {
      const job = req.body
      const result = await alljobs.insertOne(job);
      res.send(result)
    })

    app.post('/bids', async (req, res) => {
      const job = req.body
      const result = await allBids.insertOne(job);
      res.send(result)
    })

    // ALL GET HERE
    app.get('/addjobs', async (req, res) => {
      const result = await alljobs.find().toArray();
      res.send(result)
    })

    app.get('/addjobs/:id', verify, async (req, res) => {
      console.log(req.decode)
      const jobId = req.params.id
      const query = { _id: new ObjectId(jobId) };
      const result = await alljobs.find(query).toArray();
      res.send(result)
    })

    app.get('/bids',verify, async (req, res) => {
      const result = await allBids.find().toArray();
      res.send(result)
    })
    app.get('/bids/:id',verify, async (req, res) => {
      const bidId = req.params.id
      const query = { _id: new ObjectId(bidId) };
      const result = await allBids.find(query).toArray();
      res.send(result)
    })
    app.get('/postedJobs',verify, async (req, res) => {
      const result = await allBids.find().toArray();
      res.send(result)
    })

    //  ALL PUT REQUEST

    app.put('/bids/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const updatedStatus = req.body;
      const updateJobStatus = {
        $set: {
          status: updatedStatus.status
        }
      }
      // console.log(updateJobStatus)
      const result = await allBids.updateOne(query, updateJobStatus);
      res.send(result);

    })

    app.put('/addjobs/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };

      const updatedJobDetails = req.body;

      const updateJob = {
        $set: {

          title: updatedJobDetails.title,
          description: updatedJobDetails.description,
          requirement: updatedJobDetails.requirement,
          email: updatedJobDetails.email,
          category: updatedJobDetails.category,
          deadline: updatedJobDetails.deadline,
          minimum: updatedJobDetails.minimum,
          maximum: updatedJobDetails.maximum,
          photo: updatedJobDetails.photo
        }
      }

      const result = await alljobs.updateOne(query, updateJob);
      res.send(result);

    })


    // ALL DELETE REQUEST

    app.delete('/addjobs/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await confirOrdersDB.deleteOne(query);

      if (result.deletedCount > 0) {
        console.log("Successfully deleted one document.");
        res.send(result)
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
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
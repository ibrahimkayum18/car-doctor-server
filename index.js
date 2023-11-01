const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();

const port = process.env.PROT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqcfxjd.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    
    const serviceCollection = client.db('servicesDB').collection('services');
    const bookingCollection = client.db('servicesDB').collection('booking');

    app.get('/services', async(req, res) => {
        const result = await serviceCollection.find().toArray()
        res.send(result)
    })

    app.get('/services/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const result = await serviceCollection.findOne(filter)
        res.send(result)
    })

    //Bookings

    app.get('/booking', async(req, res) => {
      const result = await bookingCollection.find().toArray();
      res.send(result);
    })

    app.post('/booking', async(req, res) => {
      const data = req.body;
      const result = await bookingCollection.insertOne(data);
      res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req, res) => {
    res.send('Car Doctor Server is running');
})

app.listen(port, () => {
    console.log(`Car Doctor Server is Running on: ${port}`)
})
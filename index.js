const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

//---db----

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c8sck.mongodb.net/pran-dealer-inventory?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
  try {
    await client.connect();
    const itemCollection = client.db('pran-dealer-inventory').collection('item');
    
    //get all inventory items
    app.get('/inventory', async (req, res) => {
      const query = {};
      const cursor = itemCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    })

    //get a single item from inventory
    app.get('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const item = await itemCollection.findOne(query);
      res.send(item);
    })

    // get all items of an user 
    app.get('/myItems', async (req, res)=> {
      const email = req.query.email;
      const query = { supplier: email};
      const cursor = itemCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    })

    //add item to inventory - post
    app.post('/inventory', async (req, res) => {
      const newItem = req.body;
      const result = await itemCollection.insertOne(newItem);
      res.send(result);
    })


    //Delete item
    app.delete('/inventory/:id', async (req, res)=> {
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    })


  }
  finally {

  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello.....');
})

app.listen(port, () => {
  console.log('listening to port', port);
})
const express = require('express')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')


const app = express()
const port = process.env.PORT || 5000


//

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.STRONG_USER}:${process.env.PASSWORD_NAI}@crud-server.kqekwiv.mongodb.net/?retryWrites=true&w=majority`;



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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("CRUD-Server");
    const productCollection = database.collection("productDetails");

    app.get('/user-submit-toy-details',async(req,res)=>{
        const cursor = productCollection.find() 
        const result = await cursor.toArray()
        res.send(result);  
    })

    app.get('/user-submit-toy-details/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const user = await productCollection.findOne(query);
      res.send(user);
  })

    app.post('/user-submit-toy-details', async (req, res) => {

        const data = req.body;
        const result = await productCollection.insertOne(data);
    })
    app.patch('/user-submit-toy-details/:id', async(req, res) =>{
      const id = req.params.id;
      const toy = req.body;
      console.log(id, toy);
      
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedtoy = {
          $set: {
            price: toy.price,
            quantity: toy.quantity,
              description:toy.description
          }
      }
      const result =await productCollection.updateOne(filter,updatedtoy,options);
      res.send(result);}
    )
    app.delete('/user-submit-toy-details/:id', async(req, res) =>{
      const id = req.params.id;
      console.log(' delete from database', id);
      const query = { _id: new ObjectId(id)}
      
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);




app.get('/', (req, res) => {
  res.send('Server is start successfully')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
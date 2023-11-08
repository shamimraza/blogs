const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors({
    origin: [
        'http://localhost:5173'
    ],
    credentials: true
}));

app.use(express.json());

// mongoDB Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3fpwjd4.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        // collection

        const blogsCollection = client.db('blogDB').collection('category')

        app.get('/api/v1/category', async (req, res) => {

            let queryObj = {};
            let sortObj = {};

            const categories = req.query.categories;
            const sortField = req.query.sortField;
            const sortOrder = req.query.sortOrder;

            if (categories) {
                queryObj.categories = categories;
            }
            if (sortField && sortOrder) {
                sortObj[sortField] = sortOrder;
            }



            const cursor = blogsCollection.find(queryObj).sort(sortObj)
            const result = await cursor.toArray()

            // const total = await blogsCollection.countDocuments()
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('blogs is running')
})

app.listen(port, () => {
    console.log(`blogs is running on port ${port}`);
})
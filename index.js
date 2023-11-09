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


        const blogsCollection = client.db('blogDB').collection('category')
        const categoryCollection = client.db('blogDB').collection('blogs')
        app.post('/api/v1/blogs', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await categoryCollection.insertOne(newProduct);
            res.send(result)
        })

        app.get('/api/v1/blogs', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/api/v1/blog/:categoryName', async (req, res) => {
            const category = req.params.brandName;
            const result = await blogsCollection.find({ name: category }).toArray();
            res.send(result);
        })

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

        app.get('/api/v1/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await blogsCollection.findOne(query);
            res.send(result);
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
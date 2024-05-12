const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3001;

const uri = 'mongodb://localhost:27017';
const dbName = 'dbformation';
const client = new MongoClient(uri);

app.use(express.json());

app.listen(port, async () => {
    try {
        await client.connect();
        console.log('MongoDB connected');
        console.log(`Server running on port ${port}`);
        // console.log(new Date().getDate())
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
});

const getDatabase = () => {
    return client.db(dbName);
};

const getCollection = () => {
    return getDatabase().collection('stagiaires');
};

// CRUD Operations

// Fetch all stagiaires
app.get('/stagiaires', async (req, res) => {
    try {
        const collection = getCollection();
        const stagiaires = await collection.find().toArray();
        res.json(stagiaires);
    } catch (error) {
        res.status(500).send('Error retrieving stagiaires');
    }
});

// Fetch a single stagiaire by ID
app.get('/stagiaires/:cne', async (req, res) => {
    try {
        const collection = getCollection();
        const stagiaire = await collection.findOne({cne:req.params.cne });
        if (!stagiaire) {
            return res.status(404).send('Stagiaire not found');
        }
        res.json(stagiaire);
    } catch (error) {
        res.status(500).send('Error retrieving stagiaire');
    }
});

// Add a new stagiaire
app.post('/stagiaires', async (req, res) => {
    try {
        const collection = getCollection();
        const result = await collection.insertOne(req.body);
        res.json({message: 'data inserted success'});
    } catch (error) {
        res.json({message:'Error adding new stagiaire'});
    }
});

// Delete a stagiaire
app.delete('/stagiaires/:cne', async (req, res) => {
    try {
        const collection = getCollection();
        const result = await collection.deleteOne({cne : req.params.cne});
        if (result.deletedCount === 0) {
            res.json({message:"Stagiaire not found"})
        }
        res.json({message: 'stagiaires deleted success'});
    } catch (error) {
        res.json({message: 'warning deleted stagiaires'});
    }
});

// Update a stagiaire
app.put('/stagiaires/:cne', async (req, res) => {
    try {
        const collection = getCollection();
        const result = await collection.updateOne({ cne: req.params.cne }, { $set: req.body });
        if (result.modifiedCount === 0) {
            res.json({message:"Stagiaire not found"})
        }
        const updatedStagiaire = await collection.findOne({cne: req.params.cne});
        res.json(updatedStagiaire);
    } catch (error) {
        res.json({message:"update warning"})
    }
});

// get by age

app.get('/stagiaires/:age1/:age2', async (req, res) => {
    // ex : ageA:20 , age2:21
    try {
        const collection = await getCollection();

        const today = new Date();
        const minDate = new Date(today.getFullYear() - parseInt(req.params.age2), today.getMonth(), today.getDate());
        const maxDate = new Date(today.getFullYear() - parseInt(req.params.age1), today.getMonth(), today.getDate());

        const result = await collection.find({
            date_n: { $gte: minDate.toISOString(), $lte: maxDate.toISOString() }
        }).toArray();

        if (result.length === 0) {
            return res.json({ message: 'No stagiaires found in this age range' });
        }

        res.json(result);
    } catch (err) {
        console.error('Error while fetching stagiaires:', err);
        res.json({ message: 'An error occurred while fetching stagiaires' });
    }
});

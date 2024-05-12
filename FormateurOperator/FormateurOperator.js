const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const PORT = 2003;
const app = express();
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/dbformation")
.then(()=>console.log('db connected'))
.catch((err)=>console.log("error : ",err));

// schema
const ProductSchema = mongoose.Schema({
    nom:String,
    description: String,
    prix: Number,
    created_at: {type: Date,default: Date.now()}
});
const Product = mongoose.model('products',ProductSchema);

// meddleware
const isAuthentified = (req, res, next) => {
    const TokenKey = req.headers.authkey; 
    if (!TokenKey) {
        return res.json({ message: 'Token not found' }); 
    }
    try {
        const decode = jwt.verify(TokenKey, 'secretKey');
        if (!decode) {
            return res.json({ message: 'Token invalid' }); 
        }
        next();
    } catch (err) {
        return res.json({ message: 'Token invalid' }); 
    }
};


// post product
app.post("/product/add",isAuthentified, (req, res, next) => {
    const { nom, description, prix } = req.body;
    const newProduit = new Product({
        nom,
        description,
        prix
    });

    newProduit.save()
        .then(produit => {console.log("insertion réussie");res.json(produit);})
        .catch(error => {console.log(error.message);res.json({ error });});
});

app.listen(PORT,()=>{
    console.log('server runing at the prort :',PORT)
})
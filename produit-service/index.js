const express = require("express");
const app = express();
//const PORT = process.env.PORT_ONE || 4000;
const PORT = 4001;
const mongoose = require("mongoose");
const Produit = require("./Produit");
const isAuthenticated = require("./isAuthenticated");
app.use(express.json());

//Connection à la base de données MongoDB « publication-servicedb »
//(Mongoose créera la base de données s'il ne le trouve pas)
mongoose.connect("mongodb://127.0.0.1:27017/produit-service", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(`Produit-Service DB Connected`);
})
.catch((error) => {
  console.error("Error connecting to the database:", error);
});



app.post("/produit/ajouter", isAuthenticated, (req, res, next) => {
    //console.log("user : " + JSON.stringify(req.user)); //resultat:{"email":"karimi@gmail.com","nom":"karimi","iat":1693510589}
    const { nom, description, prix } = req.body;
    const newProduit = new Produit({
        nom,
        description,
        prix
    });
    //La méthode save() renvoie une Promise.
    //Ainsi, dans le bloc then(), nous renverrons une réponse de réussite avec un code 201 de réussite.
    //Dans le bloc catch () , nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400.
    newProduit.save()
        .then(produit => {console.log("insertion réussie");res.status(201).json(produit);})
        .catch(error => {console.log(error.message);res.status(400).json({ error });});
});


app.post("/produit/acheter", (req, res, next) => {
    const { ids:ids } = req.body;
    Produit.find({ _id: { $in: ids } })
        .then(produits => res.status(201).json(produits))
        .catch(error => res.status(400).json({ error }));
        //const receivedData = req.body;
        //res.json(req.body);
});

/* 
app.get("/produit/acheterTest", (req, res, next) => {
    const {id} = req.body;
    //console.log("prd : " + JSON.stringify(prd));
    console.log("prd.id : " + id);
    Produit.findOne({ _id: id})
        .then(produit => res.status(201).json(produit))
        .catch(error => res.status(400).json({ error }));
});

app.get("/produit", (req,res)=> {
    res.send("hey hey");
}) */
app.listen(PORT, () => {
    console.log(`Product-Service at ${PORT}`);
});

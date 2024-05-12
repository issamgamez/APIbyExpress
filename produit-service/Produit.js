const mongoose = require("mongoose");
const ProduitSchema = mongoose.Schema({
    nom: String,
    description: String,
    prix: Number,
    created_at: {
        type: Date,
        default: Date.now(),
    },
}); //,{collection : "collectionName"}}); //if we want to specifi the name of the collection explicitly
module.exports = Produit = mongoose.model("produit", ProduitSchema); //the collection is named automatically => modelName+'s'
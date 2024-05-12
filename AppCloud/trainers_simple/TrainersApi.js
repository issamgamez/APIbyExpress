 const express = require("express");
 const app = express();
 const PORT = 3000;

 app.use(express.json()) 

 let Trainers = [
    { cne: "UA1234", nom: 'el gamez', prenom: 'issam',daten:new Date("2003-08-09")},
    { cne: "UA567", nom: 'el', prenom: 'issam',daten:new Date("2003-08-09")}
 ]

//  get
app.get('/trainers',async(req,res)=>{
    if(Trainers.length > 0){
        res.json(Trainers)
    }else{
        res.json({"message":"the Trainer table is empty."})
    }
})

// get by cne
app.get('/trainer/:cne',async(req,res)=>{
    const trainer = Trainers.find((t)=>t.cne === req.params.cne)

    if(trainer){
        res.json(trainer)
    }else{
        res.json({message:`trainer with cne :${req.params.cne} is not found`})
    }
})

// post
app.post('/trainer',(req,res)=>{
    const NewTrainer = {
        cne: req.body.cne,
        nom: req.body.nom,
        prenom: req.body.prenom,
        daten:new Date(req.body.daten)
    }
    if(Trainers.push(NewTrainer)){
        res.json(NewTrainer)
    }else{
        res.json({error:"can't add this trainer"})
    }
})

// put
app.put('/trainer/:cne',(req,res)=>{
    const TrainerIndex = Trainers.findIndex((t)=>t.cne === req.params.cne);
    if(TrainerIndex !== -1){
        Trainers[TrainerIndex].nom = req.body.nom || Trainers[TrainerIndex].nom;
        Trainers[TrainerIndex].prenom = req.body.prenom || Trainers[TrainerIndex].prenom;
        Trainers[TrainerIndex].daten = new Date(req.body.daten) || Trainers[TrainerIndex].daten;
        res.json(Trainers[TrainerIndex]);
        res.json({index:TrainerIndex})
    }else{
        res.json({ message: 'trainer not found' });
    }

})

// delete
app.delete('/trainer/:cne',(req,res)=>{
    const TrainerIndex = Trainers.findIndex((t)=>t.cne === req.params.cne);
    if(TrainerIndex !== -1){
        Trainers.splice(TrainerIndex,1)
        res.json({ message: 'Delete success' });
    }else{
        res.json({ message: 'trainer not found' });
    }
})
app.listen(PORT,()=>{
    console.log(`the trainer app is runing in the port ${PORT}`)
})
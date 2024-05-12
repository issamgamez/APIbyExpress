const express = require('express')
const fs = require('fs/promises')
const app = express()
const PORT = 2003

app.use(express.json())

const TrainerData = 'Trainers/TrainerData.json';

// ReadTrainerData function
const ReadTrainerData = async()=>{
    try{
        const JsonData = await fs.readFile(TrainerData,'utf-8')
        return JSON.parse(JsonData);
    }catch(error){
        console.error('Error reading file:', error);
        return [];
    }
};

// InsertTrainerData function
const InsertTrainerData = async(NewTrainer)=>{
    try{
        await fs.writeFile(TrainerData,JSON.stringify(NewTrainer,null,2))
    }catch(error){
        console.log(`error : ${error}`)
    }
};

// get
app.get('/trainers',async(req,res)=>{
    try{
        const DATA = await ReadTrainerData();
        if(DATA !== null){
            res.json(DATA)
        }else{
            res.json({error:'error'})
        }
    }catch(error){
        console.log(`error: ${error}`)
    }
})

// get by id
app.get('/trainers/:id', async (req, res) => {
    try {
        const data = await ReadTrainerData(); 
        const trainerId = parseInt(req.params.id,10);
        const trainer = data.find((t) => t.id === trainerId);

        if (!trainer) {
            return res.status(404).json({ message: `Trainer with ID ${trainerId} not found` });
        }else{
            res.json(trainer);
        }

    } catch (error) {
        console.error(error); 
        res.json({ error: `An error occurred while retrieving the trainer: ${error.message}` });
    }
});

// post
app.post('/trainers',async(req,res)=>{
    const DATA = await ReadTrainerData();
    const NewTrainer = req.body;
    NewTrainer.id = DATA.length +1;
    DATA.push(NewTrainer);
    await InsertTrainerData(DATA);
    res.json(NewTrainer);
})

// put
app.put('/trainers/:id', async (req, res) => {
    try {
        const DATA = await ReadTrainerData();
        if (!DATA) {
            res.json({ error: 'Data not found' });
        }

        const TrainerIndex = DATA.findIndex((t) => t.id === parseInt(req.params.id));

        if (TrainerIndex !== -1) {
            const UpdatedTrainer = req.body;
            UpdatedTrainer.id = DATA[TrainerIndex].id; 
            DATA[TrainerIndex] = UpdatedTrainer;

            await InsertTrainerData(DATA);

            res.json(DATA[TrainerIndex]);
        } else {
            res.json({ message: `Trainer with ID ${req.params.id} not found` });
        }
    } catch (error) {
        res.json({ error: `Error updating trainer: ${error}` });
    }
});
// delete
app.delete('/trainers/:id', async (req, res) => {
    try {
        const data = await ReadTrainerData();
        if (!data) {
            return res.json({ error: 'Data not found' });
        }

        const trainerIndex = data.findIndex((t) => t.id === parseInt(req.params.id));

        if (trainerIndex === -1) {
            return res.json({ message: `Trainer with ID ${parseInt(req.params.id)} not found` });
        }

        const deletedTrainer = data.splice(trainerIndex, 1)[0];

        await InsertTrainerData(data); 

        res.json({ message: `Trainer with ID ${deletedTrainer.id} has been deleted` });
    } catch (error) {
        res.status(500).json({ error: `Error deleting trainer: ${error.message}` });
    }
});

app.listen(PORT, () => {
    console.log(`Server of trainer app is  running on http://localhost:${PORT}`);
  });

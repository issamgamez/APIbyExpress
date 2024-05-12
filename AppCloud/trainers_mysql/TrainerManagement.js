const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Connexion à MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'api'
});
 
db.connect((err) => {
  if (err) {
    console.error('Erreur lors de la connexion à MySQL:', err);
  } else {
    console.log('Connexion à MySQL réussie');
  }
});

// afficher tout les etudiants
app.get('/etudiants/all',(req,res)=>{
    const query = 'SELECT * FROM Etudiant';
    db.query(query, (err, result) => {
        if (err) {
          res.send(`Erreur lors de l'obtention des stagiaires: ${err}`);
        } else {
          res.json(result);
        }
      });
})

// Ajouter des étudiants
app.post('/etudiants', (req, res) => {
  const { CNE, nom, prenom, date_naissance, code_classe } = req.body;
  const query = 'INSERT INTO Etudiant (CNE, nom, prenom, date_naissance, code_classe) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [CNE, nom, prenom, date_naissance, code_classe], (err, result) => {
    if (err) {
      res.send(`Erreur lors de l'ajout de l'étudiant: ${err}`);
    } else {
      res.send(`Étudiant ajouté`);
    }
  });
});

// Supprimer les étudiants d'une classe donnée par son code
app.delete('/etudiants/classe/:code', (req, res) => {
  const code = req.params.code;
  const query = 'DELETE FROM Etudiant WHERE code_classe = ?';
  db.query(query, [code], (err, result) => {
    if (err) {
      res.send(`Erreur lors de la suppression des étudiants: ${err}`);
    } else {
      res.send(`Étudiants supprimés de la classe ${code}`);
    }
  });
});

// Renvoyer le nombre des étudiants d'une classe donnée par son code
app.get('/etudiants/classe/:code/count', (req, res) => {
  const code = req.params.code;
  const query = `SELECT COUNT(*) AS  count FROM Etudiant WHERE code_classe = ?`;
  db.query(query, [code], (err, result) => {
    if (err) {
      res.send(`Erreur lors de l'obtention du nombre d'étudiants : ${err}`);
    } else {
      res.json(result);
    }
  });
});

// Renvoyer les informations des étudiants d'une classe donnée par son code
app.get('/etudiants/classe/:code', (req, res) => {
  const code = req.params.code;
  const query = 'SELECT * FROM Etudiant WHERE code_classe = ?';
  db.query(query, [code], (err, result) => {
    if (err) {
      res.send(`Erreur lors de l'obtention des étudiants : ${err}`);
    } else {
      res.json(result);
    }
  });
});

// Modifier la classe d'un étudiant donné par son CNE
app.put('/etudiants/:CNE/classe', (req, res) => {
  const CNE = req.params.CNE;
  const { code_classe } = req.body;
  const query = 'UPDATE Etudiant SET code_classe = ? WHERE CNE = ?';
  db.query(query, [code_classe, CNE], (err, result) => {
    if (err) {
      res.send(`Erreur lors de la modification de la classe : ${err}`);
    } else {
      res.send("Classe de l'étudiant modifiée");
    }
  });
});

// Démarrer le serveur
const port =  3000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
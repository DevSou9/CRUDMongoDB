const express = require('express');
const app = express();
const port = 3010;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
const { render } = require('ejs');
const uri = process.env.URIMONGODB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const collection = client.db("db").collection("users");


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))

client.connect(err => {
    app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
});

app.get('/', (req, res) =>{
    console.log("SERVIDOR CONECTADO");
    res.render('template.ejs')
})

app.get('/item', (req, res) => {
    collection.find().toArray((err, results) => {
        if (err) return console.log(`Erro: ${err}`);
        res.render('show.ejs', {collection : results})
        console.log(`*** Finalizou o app.get`);
    })
})

 app.post('/item', (req, res) => {
    collection.insertOne(req.body, (err, result) => {
    if(err) return console.log(`Erro: ${err}`);
    res.redirect('/')
    collection.find().toArray((err, results) =>{
        console.log(`Results dos objetos salvos ${results}`);
        console.log(`*** Finalizou o app.post`);
    })
    })
 })

app.put('/item/:id', (req, res) => {
    console.log("Entrou no PUT");
    const id = req.params; 
    const filter = { _id: ObjectId(id) };
    console.log(`O filtro é: ${filter._id}`);
    const {nome, idade, status} = req.body 
    const updateDoc = { $set: { nome : nome, idade : idade, status : status} };
  
    collection.updateOne(filter, updateDoc, (err, result) => {
      if (err) {
        console.log("Erro ao atualizar o documento:", err);
        return;
      }
  
      if (result.matchedCount === 0) {
        console.log("Nenhum documento correspondente encontrado.");
      } else if (result.modifiedCount === 0) {
        console.log("Nenhum documento foi modificado.");
      } else {
        console.log("Documento atualizado com sucesso.");
      }
  
      console.log("Resultado:", result);
      res.redirect('/item');
    });
  });
  
    app.delete('/item/:id', (req, res) =>{
        const id = req.params;
        const idDel = {_id: ObjectId(id)}
        
        collection.deleteOne(idDel,
            (err, result) => {
                if(err) return console.log(`Erro: ${err}`);
            }
        )
        res.redirect('/item')
    }
    )
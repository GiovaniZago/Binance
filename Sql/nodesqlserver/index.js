const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padr�o
const connStr = "Server=localhost;Database=master;trustServerCertificate=true;User Id=sa;Password=Janeiro@2023;";
const sql = require("mssql");

//fazendo a conex�o global
sql.connect(connStr)
   .then(conn => global.conn = conn)
   .catch(err => console.log(err));

   //configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!');
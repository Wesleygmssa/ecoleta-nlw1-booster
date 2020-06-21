
import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes'; 

const app = express();

app.use(cors()); // para colocar online, fazer deploy
app.use(express.json()); //entendo corpo da requição formato Json
app.use(routes); 

app.use('/uploads', express.static(path.resolve(__dirname,'..','uploads'))) //diretorio imagem http://localhost:3333/uploads/baterias.svg 


app.listen(3333);

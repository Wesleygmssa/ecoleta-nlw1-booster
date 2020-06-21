import express from 'express'; 
import multer from 'multer';
import multerConfig from './config/multer'

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/itemsController';

//Algums nomes padrão da comunidade // index, create, update, delete

const routes = express.Router(); // desaclopar para outro arquivo
const upload = multer(multerConfig);


const pointsController = new PointsController(); //Estanciando class
const itemsController = new  ItemsController(); 


routes.get('/items',itemsController.index);

routes.post('/points', upload.single('image'), pointsController.create); 

routes.get('/points', pointsController.index);

routes.get('/points/:id', pointsController.show ); 




export default routes; 
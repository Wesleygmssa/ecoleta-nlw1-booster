import {Request, Response} from 'express'; // usando typescript.
import knex from '../database/connection'; // conexão com banco de dados.

class ItemsController{

    async index (request:Request, response: Response) { 

        const items = await knex('items').select('*'); // pegando todos items do banco de dados
     
        const serializedItems = items.map(item => { // transformando dados para novo formato chamando de serializedImtes

          return {

            id: item.id,
            title: item.title,
            image_url: `http://192.168.1.102:3333/uploads/${item.image}`, //criando caminho para imagem //192.168.1.102:3333 //172.16.0.7:3333

          };

        });
  
        // console.log(serializedItems) retornando todos os items 
        return response.json(serializedItems);
      
      }
}

export default ItemsController
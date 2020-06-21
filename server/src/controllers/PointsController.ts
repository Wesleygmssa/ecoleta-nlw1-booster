import { Request, Response } from 'express'; // usando typescript.
import knex from '../database/connection'; // conexão com banco de dados.


class pointsController {
  
  async index(request: Request, response: Response) { // usando type script


    //cidade, uf , items (Query Params)
    const {city, uf, items} = request.query;

    const parsedItems = String(items)
    .split(',') // transformando array
    .map(item => Number(item.trim())); // tirando espaçamento e forçando ser array numerico

   const points = await knex('points')
   .join('point_items', 'points.id', '=', 'point_items.point_id')
   .whereIn('point_items.item_id', parsedItems)
   .where('city', String(city))
   .where('uf', String(uf))
   .distinct()
   .select('points.*')
  

   console.log(points)

    return response.json(points)
  

  }



  async show(request: Request, response: Response) {
    
    const { id } = request.params; // desestruturação

    const point = await knex('points').where('id', id).first(); //pegando um unico registo no banco de dados

    if (!point) { // se nçao encontrar retorna um erro
      return response.status(400).json({ message: 'Point not found.' })
    }
    /*** 
     *  SELECT * FROM ITEMS
     *  JOIN point_items on items.id = point_items.item_id
     *  WHERE point_items.point_id = {id}
      */
    const items = await knex('items') // listando todos itmes que tem realção com ponto de coleta
      .join('point_items', 'items.id', '=', 'point_items.item_id') // juntando tabelas
      .where('point_items.point_id', id)
      .select('items.title')

    return response.json({ point, items });

  }



  async create(request: Request, response: Response) {

    const { 
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = request.body; // destruturação colocando cada um em uma variavel diferente

    const trx = await knex.transaction();

    const point = { //enviado os dados que vem do form
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    }

    //retornaod id no points
    const insertedIds = await trx('points').insert(point); // inserindo dados no banco de dados

    const point_id = insertedIds[0]

    // items =  um array de numeros , identificando a posicção do item selecionado
    const pointItems = items
    .split(',') //transformando em array
    .map((item: string) => Number(item.trim()))
    .map((item_id: number) => {  // fazendo relacionamento entre tabelas
      return {
        item_id,
        point_id,
      }
    })
    
    await trx('point_items').insert(pointItems); // inserindo em outra tabela os dados de items

    await trx.commit();

    return response.json({
      id: point_id,
      ...point,

    }) // reposta true
  }
}

export default pointsController;
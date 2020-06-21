import Knex from 'knex';

 //INSERIDO DADOS DOS ITEMS  NA TABELA
 //FICANDO PRÉ ESTABELECIDO PELO SISTEMA SEM USUÁRIO PODER CADASTRAR

 export async function seed(knex:Knex){

  await knex('items').insert([ 

        {title:'Lâmpadas', image:'lampadas.svg'},
        {title:'Pilhas e Baterias', image:'baterias.svg'},
        {title:'Papeis e Papelão', image:'papeis-papelao.svg'},
        {title:'Resíduos Eletrônicos', image:'eletronicos.svg'},
        {title:'Resídos Orgânico', image:'organicos.svg'},
        {title:'Óleo de Cozinha', image:'oleo.svg'},
        
    ]);
}
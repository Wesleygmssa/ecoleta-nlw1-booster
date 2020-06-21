import Knex from 'knex';// usando typescript


export async function up(knex: Knex) {
         // CRIAR TABELA //
    return knex.schema.createTable('point_items', table => {
        
        table.increments('id').primary();

//FAZENDO RELACINAMENTO DOS ITEMs E PONTO DE COLETA

        /* TABELA PONTO */

        table.integer('point_id')
        .notNullable()
        .references('id')
        .inTable('points');

        /* TABELA ITEMS */
        table.integer('item_id')
        .notNullable()
        .references('id')
        .inTable('items');
    })
}
export async function down(knex: Knex) {
    // VOLTAR ATRAS (DELETAR A TABELA)
    knex.schema.dropTable('point_items');
}

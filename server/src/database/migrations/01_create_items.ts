//SEGUNDA TABELA

import Knex from 'knex';// usando typescript

export async function up(knex: Knex) {
    // CRIAR TABELA DE ITEMS
    return knex.schema.createTable('items', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();


    })
}
export async function down(knex: Knex) {
    // VOLTAR ATRAS (DELETAR A TABELA)
    knex.schema.dropTable('items');
}

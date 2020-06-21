/* **
CONNFIGURAÇÃO DE CONEXAO COM BANCO DE DADOS
*/
import knex from 'knex';// 
import path from 'path';//caminho

const connection = knex({ //configurações do banco de dados
    client: 'sqlite3',
    connection:{
        filename: path.resolve(__dirname, 'database.sqlite')// (path.resolve unir caminhos de acordo o sistema operacional).
                                                            //__dirname -> retorna diretorio do arquivo que esta sendo excutado.
    },
    useNullAsDefault:true

});

export default connection;

// Migrations = Histórico do banco de dados
// create table points;
// create table users;
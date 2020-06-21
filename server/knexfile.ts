
import path from 'path';

module.exports = {
    client: 'sqlite3',
    connection:{
        filename: path.resolve(__dirname, 'src', 'database','database.sqlite'), //path connection
    },
    migrations:{
        directory: path.resolve(__dirname, 'src', 'database', 'migrations'), // cretate tabela 
    },
    seeds:{
        directory: path.resolve(__dirname, 'src', 'database', 'seeds'), // insert data
    },
 
    useNullAsDefault: true,
};
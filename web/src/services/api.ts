//UTILIZANDO BLIBLIOTECA API.
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3333' // vai se repetir em todas  as requições
});

// fetch uma função alternativa

export default api;
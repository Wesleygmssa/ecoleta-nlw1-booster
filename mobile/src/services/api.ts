//criando api para pegar os dados

import axios from 'axios';

const api = axios.create({
    // exp://172.16.0.7:19000
   //192.168.1.102:3333
   baseURL: 'http:192.168.1.102:3333' 
});

export default api;
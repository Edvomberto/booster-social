import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://ws-booster-social-5040b10dd814.herokuapp.com', // Ajuste para o URL do seu backend
});

export default instance;

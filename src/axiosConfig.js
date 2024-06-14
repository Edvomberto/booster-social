import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://ws-booster-social-5040b10dd814.herokuapp.com/api', // Ajuste para o URL do seu backend
  // baseURL: 'http://localhost:5000/api',
});

export default instance;

import axios from 'axios';

// Para emulador Android: 10.0.2.2 é o IP da máquina host.
// Se estiver usando um dispositivo físico, use o IP da sua rede local.
const api = axios.create({
  baseURL: 'http://10.0.2.2:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 
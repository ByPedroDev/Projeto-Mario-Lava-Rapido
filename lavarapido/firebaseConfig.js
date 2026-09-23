import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

// Configuração do projeto no Firebase.
// Pegue esses valores em: Console do Firebase > Configurações do projeto >
// Seus apps > App da Web (</>) > "Configuração do SDK".
const firebaseConfig = {
  apiKey: 'COLE_AQUI',
  authDomain: 'COLE_AQUI',
  projectId: 'COLE_AQUI',
  storageBucket: 'COLE_AQUI',
  messagingSenderId: 'COLE_AQUI',
  appId: 'COLE_AQUI',
};

// Enquanto algum campo estiver com 'COLE_AQUI', a tela inicial mostra um aviso
export const firebaseConfigurado = !Object.values(firebaseConfig).includes('COLE_AQUI');

const app = initializeApp(firebaseConfig);

// Long polling deixa a conexão com o Firestore mais estável no Expo Go (Android)
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });

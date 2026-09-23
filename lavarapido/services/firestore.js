import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../firebaseConfig';

// Funções do CRUD usadas por todas as Collections do sistema.

// C - Create: adiciona um documento novo (o Firestore gera o id)
export function cadastrar(nomeColecao, dados) {
  return addDoc(collection(db, nomeColecao), { ...dados, criadoEm: serverTimestamp() });
}

// R - Read: escuta a Collection em tempo real, já ordenada por um campo.
// Retorna a função que para de escutar (usada no "cleanup" do useEffect).
export function ouvirColecao(nomeColecao, campoOrdem, aoMudar, aoErro, direcao = 'asc') {
  const consulta = query(collection(db, nomeColecao), orderBy(campoOrdem, direcao));

  return onSnapshot(
    consulta,
    (snapshot) => {
      const lista = snapshot.docs.map((documento) => {
        // As datas de controle ficam de fora para o item poder ir nos params da navegação
        const { criadoEm, alteradoEm, ...campos } = documento.data();
        return { id: documento.id, ...campos };
      });
      aoMudar(lista);
    },
    aoErro
  );
}

// U - Update: altera os campos de um documento existente
export function alterar(nomeColecao, id, dados) {
  return updateDoc(doc(db, nomeColecao, id), { ...dados, alteradoEm: serverTimestamp() });
}

// D - Delete: remove o documento
export function excluir(nomeColecao, id) {
  return deleteDoc(doc(db, nomeColecao, id));
}

// Converte texto digitado ("25,90") em número (25.9). Retorna NaN se for inválido.
export function paraNumero(texto) {
  return Number(String(texto).replace(',', '.').trim());
}

// Formata um número como dinheiro: 25.9 -> "R$ 25,90"
export function formatarPreco(valor) {
  return 'R$ ' + Number(valor || 0).toFixed(2).replace('.', ',');
}

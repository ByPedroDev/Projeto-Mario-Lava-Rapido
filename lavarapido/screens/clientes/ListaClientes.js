import React, { useEffect, useState } from 'react';

import ListaDocumentos from '../../components/ListaDocumentos';
import ItemLista from '../../components/ItemLista';
import { avisar, confirmar } from '../../components/alertas';
import { ouvirColecao, excluir } from '../../services/firestore';

// Tela de LISTAGEM dos clientes, com as opções Alterar e Excluir
export default function ListaClientes({ navigation }) {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Escuta a Collection "clientes" em tempo real (atualiza sozinha ao cadastrar/alterar/excluir)
  useEffect(() => {
    const pararDeOuvir = ouvirColecao(
      'clientes',
      'nome',
      (lista) => { setClientes(lista); setCarregando(false); },
      (e) => { setErro(e.message); setCarregando(false); }
    );
    return pararDeOuvir;
  }, []);

  async function remover(cliente) {
    const ok = await confirmar('Excluir cliente', `Deseja mesmo excluir "${cliente.nome}"?`);
    if (!ok) return;
    try {
      await excluir('clientes', cliente.id);
    } catch (e) {
      avisar('Erro', 'Não foi possível excluir: ' + e.message);
    }
  }

  return (
    <ListaDocumentos
      itens={clientes}
      carregando={carregando}
      erro={erro}
      textoVazio="Nenhum cliente cadastrado ainda."
      renderItem={({ item }) => (
        <ItemLista
          icone="person-outline"
          titulo={item.nome}
          linhas={[
            `Telefone: ${item.telefone}`,
            item.email && `E-mail: ${item.email}`,
            item.cpf && `CPF: ${item.cpf}`,
          ]}
          aoAlterar={() => navigation.navigate('Cadastro', { item })}
          aoExcluir={() => remover(item)}
        />
      )}
    />
  );
}

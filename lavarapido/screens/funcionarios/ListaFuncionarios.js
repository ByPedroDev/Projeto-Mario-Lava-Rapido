import React, { useEffect, useState } from 'react';

import ListaDocumentos from '../../components/ListaDocumentos';
import ItemLista from '../../components/ItemLista';
import { avisar, confirmar } from '../../components/alertas';
import { ouvirColecao, excluir } from '../../services/firestore';

// Listagem dos funcionários com Alterar e Excluir
export default function ListaFuncionarios({ navigation }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const pararDeOuvir = ouvirColecao(
      'funcionarios',
      'nome',
      (lista) => { setFuncionarios(lista); setCarregando(false); },
      (e) => { setErro(e.message); setCarregando(false); }
    );
    return pararDeOuvir;
  }, []);

  async function remover(funcionario) {
    const ok = await confirmar('Excluir funcionário', `Deseja mesmo excluir "${funcionario.nome}"?`);
    if (!ok) return;
    try {
      await excluir('funcionarios', funcionario.id);
    } catch (e) {
      avisar('Erro', 'Não foi possível excluir: ' + e.message);
    }
  }

  return (
    <ListaDocumentos
      itens={funcionarios}
      carregando={carregando}
      erro={erro}
      textoVazio="Nenhum funcionário cadastrado ainda."
      renderItem={({ item }) => (
        <ItemLista
          icone="id-card-outline"
          titulo={item.nome}
          destaque={item.cargo}
          linhas={[`Telefone: ${item.telefone}`, item.email && `E-mail: ${item.email}`]}
          aoAlterar={() => navigation.navigate('Cadastro', { item })}
          aoExcluir={() => remover(item)}
        />
      )}
    />
  );
}

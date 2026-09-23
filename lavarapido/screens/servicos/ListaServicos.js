import React, { useEffect, useState } from 'react';

import ListaDocumentos from '../../components/ListaDocumentos';
import ItemLista from '../../components/ItemLista';
import { avisar, confirmar } from '../../components/alertas';
import { ouvirColecao, excluir, formatarPreco } from '../../services/firestore';

// Listagem dos serviços com Alterar e Excluir
export default function ListaServicos({ navigation }) {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const pararDeOuvir = ouvirColecao(
      'servicos',
      'nome',
      (lista) => { setServicos(lista); setCarregando(false); },
      (e) => { setErro(e.message); setCarregando(false); }
    );
    return pararDeOuvir;
  }, []);

  async function remover(servico) {
    const ok = await confirmar('Excluir serviço', `Deseja mesmo excluir "${servico.nome}"?`);
    if (!ok) return;
    try {
      await excluir('servicos', servico.id);
    } catch (e) {
      avisar('Erro', 'Não foi possível excluir: ' + e.message);
    }
  }

  return (
    <ListaDocumentos
      itens={servicos}
      carregando={carregando}
      erro={erro}
      textoVazio="Nenhum serviço cadastrado ainda."
      renderItem={({ item }) => (
        <ItemLista
          icone="sparkles-outline"
          titulo={item.nome}
          destaque={formatarPreco(item.preco)}
          linhas={[item.descricao, `Duração: ${item.duracaoMin} min`]}
          aoAlterar={() => navigation.navigate('Cadastro', { item })}
          aoExcluir={() => remover(item)}
        />
      )}
    />
  );
}

import React, { useEffect, useState } from 'react';

import ListaDocumentos from '../../components/ListaDocumentos';
import ItemLista from '../../components/ItemLista';
import { avisar, confirmar } from '../../components/alertas';
import { ouvirColecao, excluir } from '../../services/firestore';

// Listagem dos veículos com Alterar e Excluir
export default function ListaVeiculos({ navigation }) {
  const [veiculos, setVeiculos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const pararDeOuvir = ouvirColecao(
      'veiculos',
      'placa',
      (lista) => { setVeiculos(lista); setCarregando(false); },
      (e) => { setErro(e.message); setCarregando(false); }
    );
    return pararDeOuvir;
  }, []);

  async function remover(veiculo) {
    const ok = await confirmar('Excluir veículo', `Deseja mesmo excluir o veículo ${veiculo.placa}?`);
    if (!ok) return;
    try {
      await excluir('veiculos', veiculo.id);
    } catch (e) {
      avisar('Erro', 'Não foi possível excluir: ' + e.message);
    }
  }

  return (
    <ListaDocumentos
      itens={veiculos}
      carregando={carregando}
      erro={erro}
      textoVazio="Nenhum veículo cadastrado ainda."
      renderItem={({ item }) => (
        <ItemLista
          icone="car-sport-outline"
          titulo={`${item.marca} ${item.modelo}`.trim()}
          destaque={item.placa}
          linhas={[`Dono: ${item.clienteNome}`, item.cor && `Cor: ${item.cor}`]}
          aoAlterar={() => navigation.navigate('Cadastro', { item })}
          aoExcluir={() => remover(item)}
        />
      )}
    />
  );
}

import React, { useEffect, useState } from 'react';

import ListaDocumentos from '../../components/ListaDocumentos';
import ItemLista from '../../components/ItemLista';
import { avisar, confirmar } from '../../components/alertas';
import { ouvirColecao, excluir, formatarPreco } from '../../services/firestore';
import cores from '../../styles/cores';

// Cor da etiqueta de acordo com o status do agendamento
const COR_STATUS = {
  Agendado: cores.primaria,
  'Em lavagem': cores.alerta,
  Pronto: cores.sucesso,
  Entregue: cores.textoSuave,
  Cancelado: cores.perigo,
};

// Listagem dos agendamentos (mais recentes primeiro) com Alterar e Excluir
export default function ListaAgendamentos({ navigation }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const pararDeOuvir = ouvirColecao(
      'agendamentos',
      'dataHoraOrdem',
      (lista) => { setAgendamentos(lista); setCarregando(false); },
      (e) => { setErro(e.message); setCarregando(false); },
      'desc'
    );
    return pararDeOuvir;
  }, []);

  async function remover(agendamento) {
    const ok = await confirmar(
      'Excluir agendamento',
      `Deseja mesmo excluir o agendamento de ${agendamento.clienteNome} em ${agendamento.data}?`
    );
    if (!ok) return;
    try {
      await excluir('agendamentos', agendamento.id);
    } catch (e) {
      avisar('Erro', 'Não foi possível excluir: ' + e.message);
    }
  }

  return (
    <ListaDocumentos
      itens={agendamentos}
      carregando={carregando}
      erro={erro}
      textoVazio="Nenhum agendamento cadastrado ainda."
      renderItem={({ item }) => (
        <ItemLista
          icone="calendar-outline"
          titulo={`${item.data} às ${item.hora}`}
          destaque={item.status}
          corDestaque={COR_STATUS[item.status]}
          linhas={[
            `Cliente: ${item.clienteNome}`,
            `Veículo: ${item.veiculoDescricao}`,
            `Serviço: ${item.servicoNome} — ${formatarPreco(item.valor)}`,
            `Funcionário: ${item.funcionarioNome}`,
            item.observacao && `Obs.: ${item.observacao}`,
          ]}
          aoAlterar={() => navigation.navigate('Cadastro', { item })}
          aoExcluir={() => remover(item)}
        />
      )}
    />
  );
}

import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

import Campo from '../../components/Campo';
import Botao from '../../components/Botao';
import Seletor from '../../components/Seletor';
import { avisar } from '../../components/alertas';
import { cadastrar, alterar, ouvirColecao, paraNumero, formatarPreco } from '../../services/firestore';
import estilos from '../../styles/estilos';

export const STATUS = ['Agendado', 'Em lavagem', 'Pronto', 'Entregue', 'Cancelado'];

// Cadastro / alteração de um agendamento de lavagem.
// Liga as outras 4 Collections: cliente, veículo, serviço e funcionário.
export default function CadastroAgendamento({ navigation, route }) {
  const editando = route.params?.item;

  const [clienteId, setClienteId] = useState(editando?.clienteId ?? '');
  const [veiculoId, setVeiculoId] = useState(editando?.veiculoId ?? '');
  const [servicoId, setServicoId] = useState(editando?.servicoId ?? '');
  const [funcionarioId, setFuncionarioId] = useState(editando?.funcionarioId ?? '');
  const [data, setData] = useState(editando?.data ?? '');
  const [hora, setHora] = useState(editando?.hora ?? '');
  const [valor, setValor] = useState(editando ? String(editando.valor).replace('.', ',') : '');
  const [status, setStatus] = useState(editando?.status ?? 'Agendado');
  const [observacao, setObservacao] = useState(editando?.observacao ?? '');
  const [salvando, setSalvando] = useState(false);

  const [clientes, setClientes] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);

  // Carrega as 4 Collections usadas nos seletores
  useEffect(() => {
    const aoErro = (e) => avisar('Erro', e.message);
    const paradas = [
      ouvirColecao('clientes', 'nome', setClientes, aoErro),
      ouvirColecao('veiculos', 'placa', setVeiculos, aoErro),
      ouvirColecao('servicos', 'nome', setServicos, aoErro),
      ouvirColecao('funcionarios', 'nome', setFuncionarios, aoErro),
    ];
    return () => paradas.forEach((parar) => parar());
  }, []);

  // Só mostra os veículos do cliente escolhido
  const veiculosDoCliente = veiculos.filter((v) => v.clienteId === clienteId);

  function escolherCliente(id) {
    setClienteId(id);
    setVeiculoId('');
  }

  // Ao escolher o serviço, o valor é preenchido com o preço dele (dá pra mudar depois)
  function escolherServico(id) {
    setServicoId(id);
    const servico = servicos.find((s) => s.id === id);
    if (servico) setValor(String(servico.preco).replace('.', ','));
  }

  async function salvar() {
    const valorNumero = paraNumero(valor);
    const dataValida = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data.trim());
    const horaValida = /^([01]\d|2[0-3]):[0-5]\d$/.test(hora.trim());

    if (!clienteId || !veiculoId || !servicoId || !funcionarioId) {
      avisar('Atenção', 'Escolha o cliente, o veículo, o serviço e o funcionário.');
      return;
    }
    if (!dataValida || !horaValida) {
      avisar('Atenção', 'Informe a data no formato dd/mm/aaaa e a hora no formato hh:mm.');
      return;
    }
    if (isNaN(valorNumero) || valorNumero < 0) {
      avisar('Atenção', 'Informe um valor válido. Ex.: 49,90');
      return;
    }

    const cliente = clientes.find((c) => c.id === clienteId);
    const veiculo = veiculos.find((v) => v.id === veiculoId);
    const servico = servicos.find((s) => s.id === servicoId);
    const funcionario = funcionarios.find((f) => f.id === funcionarioId);
    const [, dia, mes, ano] = dataValida;

    const dados = {
      clienteId,
      clienteNome: cliente?.nome ?? editando?.clienteNome ?? '',
      veiculoId,
      veiculoDescricao: veiculo ? `${veiculo.modelo} - ${veiculo.placa}` : editando?.veiculoDescricao ?? '',
      servicoId,
      servicoNome: servico?.nome ?? editando?.servicoNome ?? '',
      funcionarioId,
      funcionarioNome: funcionario?.nome ?? editando?.funcionarioNome ?? '',
      data: data.trim(),
      hora: hora.trim(),
      // "2026-09-23 14:30": texto que ordena certo por data e hora na listagem
      dataHoraOrdem: `${ano}-${mes}-${dia} ${hora.trim()}`,
      valor: valorNumero,
      status,
      observacao: observacao.trim(),
    };

    setSalvando(true);
    try {
      if (editando) {
        await alterar('agendamentos', editando.id, dados);
        avisar('Pronto', 'Agendamento alterado com sucesso!');
        navigation.goBack();
      } else {
        await cadastrar('agendamentos', dados);
        avisar('Pronto', 'Agendamento cadastrado com sucesso!');
        navigation.replace('Lista');
      }
    } catch (erro) {
      avisar('Erro', 'Não foi possível salvar: ' + erro.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
      <Seletor
        rotulo="Cliente *"
        opcoes={clientes.map((c) => ({ valor: c.id, texto: c.nome }))}
        valor={clienteId}
        aoSelecionar={escolherCliente}
        textoVazio="Cadastre um cliente primeiro."
      />
      <Seletor
        rotulo="Veículo *"
        opcoes={veiculosDoCliente.map((v) => ({ valor: v.id, texto: `${v.modelo} - ${v.placa}` }))}
        valor={veiculoId}
        aoSelecionar={setVeiculoId}
        textoVazio={clienteId ? 'Esse cliente não tem veículo cadastrado.' : 'Escolha o cliente primeiro.'}
      />
      <Seletor
        rotulo="Serviço *"
        opcoes={servicos.map((s) => ({ valor: s.id, texto: `${s.nome} (${formatarPreco(s.preco)})` }))}
        valor={servicoId}
        aoSelecionar={escolherServico}
        textoVazio="Cadastre um serviço primeiro."
      />
      <Seletor
        rotulo="Funcionário responsável *"
        opcoes={funcionarios.map((f) => ({ valor: f.id, texto: `${f.nome} (${f.cargo})` }))}
        valor={funcionarioId}
        aoSelecionar={setFuncionarioId}
        textoVazio="Cadastre um funcionário primeiro."
      />
      <Campo rotulo="Data *" value={data} onChangeText={setData} placeholder="dd/mm/aaaa" keyboardType="numbers-and-punctuation" maxLength={10} />
      <Campo rotulo="Hora *" value={hora} onChangeText={setHora} placeholder="hh:mm" keyboardType="numbers-and-punctuation" maxLength={5} />
      <Campo rotulo="Valor (R$) *" value={valor} onChangeText={setValor} placeholder="49,90" keyboardType="decimal-pad" />
      <Seletor
        rotulo="Status"
        opcoes={STATUS.map((s) => ({ valor: s, texto: s }))}
        valor={status}
        aoSelecionar={setStatus}
      />
      <Campo
        rotulo="Observação"
        value={observacao}
        onChangeText={setObservacao}
        placeholder="Ex.: cliente pediu cera extra"
        multiline
        style={[estilos.input, { minHeight: 70, textAlignVertical: 'top' }]}
      />

      <Botao
        titulo={editando ? 'Salvar alterações' : 'Cadastrar agendamento'}
        icone="save-outline"
        carregando={salvando}
        onPress={salvar}
      />
    </ScrollView>
  );
}

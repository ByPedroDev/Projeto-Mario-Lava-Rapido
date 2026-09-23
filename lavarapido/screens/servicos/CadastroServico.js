import React, { useState } from 'react';
import { ScrollView } from 'react-native';

import Campo from '../../components/Campo';
import Botao from '../../components/Botao';
import { avisar } from '../../components/alertas';
import { cadastrar, alterar, paraNumero } from '../../services/firestore';
import estilos from '../../styles/estilos';

// Cadastro / alteração de um serviço oferecido pelo lava rápido
export default function CadastroServico({ navigation, route }) {
  const editando = route.params?.item;

  const [nome, setNome] = useState(editando?.nome ?? '');
  const [descricao, setDescricao] = useState(editando?.descricao ?? '');
  // Números viram texto para aparecer no TextInput
  const [preco, setPreco] = useState(editando ? String(editando.preco).replace('.', ',') : '');
  const [duracao, setDuracao] = useState(editando ? String(editando.duracaoMin) : '');
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    const precoNumero = paraNumero(preco);
    const duracaoNumero = parseInt(duracao, 10);

    if (!nome.trim()) {
      avisar('Atenção', 'Informe o nome do serviço.');
      return;
    }
    if (isNaN(precoNumero) || precoNumero <= 0) {
      avisar('Atenção', 'Informe um preço válido. Ex.: 49,90');
      return;
    }
    if (isNaN(duracaoNumero) || duracaoNumero <= 0) {
      avisar('Atenção', 'Informe a duração em minutos. Ex.: 40');
      return;
    }

    const dados = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      preco: precoNumero,
      duracaoMin: duracaoNumero,
    };

    setSalvando(true);
    try {
      if (editando) {
        await alterar('servicos', editando.id, dados);
        avisar('Pronto', 'Serviço alterado com sucesso!');
        navigation.goBack();
      } else {
        await cadastrar('servicos', dados);
        avisar('Pronto', 'Serviço cadastrado com sucesso!');
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
      <Campo rotulo="Nome do serviço *" value={nome} onChangeText={setNome} placeholder="Ex.: Lavagem completa" />
      <Campo
        rotulo="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Ex.: Lavagem externa, aspiração e pretinho nos pneus"
        multiline
        style={[estilos.input, { minHeight: 80, textAlignVertical: 'top' }]}
      />
      <Campo rotulo="Preço (R$) *" value={preco} onChangeText={setPreco} placeholder="49,90" keyboardType="decimal-pad" />
      <Campo rotulo="Duração (minutos) *" value={duracao} onChangeText={setDuracao} placeholder="40" keyboardType="number-pad" />

      <Botao
        titulo={editando ? 'Salvar alterações' : 'Cadastrar serviço'}
        icone="save-outline"
        carregando={salvando}
        onPress={salvar}
      />
    </ScrollView>
  );
}

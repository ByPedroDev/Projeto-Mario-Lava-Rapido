import React, { useState } from 'react';
import { ScrollView } from 'react-native';

import Campo from '../../components/Campo';
import Botao from '../../components/Botao';
import Seletor from '../../components/Seletor';
import { avisar } from '../../components/alertas';
import { cadastrar, alterar } from '../../services/firestore';
import estilos from '../../styles/estilos';

const CARGOS = ['Lavador', 'Polidor', 'Atendente', 'Gerente'];

// Cadastro / alteração de um funcionário do lava rápido
export default function CadastroFuncionario({ navigation, route }) {
  const editando = route.params?.item;

  const [nome, setNome] = useState(editando?.nome ?? '');
  const [cargo, setCargo] = useState(editando?.cargo ?? '');
  const [telefone, setTelefone] = useState(editando?.telefone ?? '');
  const [email, setEmail] = useState(editando?.email ?? '');
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (!nome.trim() || !cargo || !telefone.trim()) {
      avisar('Atenção', 'Preencha nome, cargo e telefone.');
      return;
    }

    const dados = {
      nome: nome.trim(),
      cargo,
      telefone: telefone.trim(),
      email: email.trim(),
    };

    setSalvando(true);
    try {
      if (editando) {
        await alterar('funcionarios', editando.id, dados);
        avisar('Pronto', 'Funcionário alterado com sucesso!');
        navigation.goBack();
      } else {
        await cadastrar('funcionarios', dados);
        avisar('Pronto', 'Funcionário cadastrado com sucesso!');
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
      <Campo rotulo="Nome *" value={nome} onChangeText={setNome} placeholder="Ex.: João Lima" />
      <Seletor
        rotulo="Cargo *"
        opcoes={CARGOS.map((c) => ({ valor: c, texto: c }))}
        valor={cargo}
        aoSelecionar={setCargo}
      />
      <Campo rotulo="Telefone *" value={telefone} onChangeText={setTelefone} placeholder="(11) 99999-9999" keyboardType="phone-pad" />
      <Campo rotulo="E-mail" value={email} onChangeText={setEmail} placeholder="joao@email.com" keyboardType="email-address" autoCapitalize="none" />

      <Botao
        titulo={editando ? 'Salvar alterações' : 'Cadastrar funcionário'}
        icone="save-outline"
        carregando={salvando}
        onPress={salvar}
      />
    </ScrollView>
  );
}

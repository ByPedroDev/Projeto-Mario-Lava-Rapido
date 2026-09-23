import React, { useState } from 'react';
import { ScrollView } from 'react-native';

import Campo from '../../components/Campo';
import Botao from '../../components/Botao';
import { avisar } from '../../components/alertas';
import { cadastrar, alterar } from '../../services/firestore';
import estilos from '../../styles/estilos';

// Tela usada para CADASTRAR e para ALTERAR um cliente.
// Quando vem da listagem com route.params.item, a tela entra no modo "alterar".
export default function CadastroCliente({ navigation, route }) {
  const editando = route.params?.item;

  const [nome, setNome] = useState(editando?.nome ?? '');
  const [telefone, setTelefone] = useState(editando?.telefone ?? '');
  const [email, setEmail] = useState(editando?.email ?? '');
  const [cpf, setCpf] = useState(editando?.cpf ?? '');
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (!nome.trim() || !telefone.trim()) {
      avisar('Atenção', 'Preencha pelo menos o nome e o telefone.');
      return;
    }

    const dados = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim(),
      cpf: cpf.trim(),
    };

    setSalvando(true);
    try {
      if (editando) {
        await alterar('clientes', editando.id, dados);
        avisar('Pronto', 'Cliente alterado com sucesso!');
        navigation.goBack();
      } else {
        await cadastrar('clientes', dados);
        avisar('Pronto', 'Cliente cadastrado com sucesso!');
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
      <Campo rotulo="Nome *" value={nome} onChangeText={setNome} placeholder="Ex.: Maria Souza" />
      <Campo rotulo="Telefone *" value={telefone} onChangeText={setTelefone} placeholder="(11) 99999-9999" keyboardType="phone-pad" />
      <Campo rotulo="E-mail" value={email} onChangeText={setEmail} placeholder="maria@email.com" keyboardType="email-address" autoCapitalize="none" />
      <Campo rotulo="CPF" value={cpf} onChangeText={setCpf} placeholder="000.000.000-00" keyboardType="numeric" />

      <Botao
        titulo={editando ? 'Salvar alterações' : 'Cadastrar cliente'}
        icone="save-outline"
        carregando={salvando}
        onPress={salvar}
      />
    </ScrollView>
  );
}

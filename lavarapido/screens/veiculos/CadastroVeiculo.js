import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

import Campo from '../../components/Campo';
import Botao from '../../components/Botao';
import Seletor from '../../components/Seletor';
import { avisar } from '../../components/alertas';
import { cadastrar, alterar, ouvirColecao } from '../../services/firestore';
import estilos from '../../styles/estilos';

// Cadastro / alteração de um veículo. Todo veículo pertence a um cliente.
export default function CadastroVeiculo({ navigation, route }) {
  const editando = route.params?.item;

  const [placa, setPlaca] = useState(editando?.placa ?? '');
  const [marca, setMarca] = useState(editando?.marca ?? '');
  const [modelo, setModelo] = useState(editando?.modelo ?? '');
  const [cor, setCor] = useState(editando?.cor ?? '');
  const [clienteId, setClienteId] = useState(editando?.clienteId ?? '');
  const [clientes, setClientes] = useState([]);
  const [salvando, setSalvando] = useState(false);

  // Busca os clientes para o usuário escolher o dono do veículo
  useEffect(() => {
    return ouvirColecao('clientes', 'nome', setClientes, (e) => avisar('Erro', e.message));
  }, []);

  async function salvar() {
    if (!placa.trim() || !modelo.trim() || !clienteId) {
      avisar('Atenção', 'Preencha a placa, o modelo e escolha o cliente.');
      return;
    }

    const cliente = clientes.find((c) => c.id === clienteId);

    const dados = {
      placa: placa.trim().toUpperCase(),
      marca: marca.trim(),
      modelo: modelo.trim(),
      cor: cor.trim(),
      clienteId,
      // Guardamos o nome também para mostrar na lista sem precisar buscar o cliente
      clienteNome: cliente ? cliente.nome : editando?.clienteNome ?? '',
    };

    setSalvando(true);
    try {
      if (editando) {
        await alterar('veiculos', editando.id, dados);
        avisar('Pronto', 'Veículo alterado com sucesso!');
        navigation.goBack();
      } else {
        await cadastrar('veiculos', dados);
        avisar('Pronto', 'Veículo cadastrado com sucesso!');
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
        rotulo="Cliente (dono) *"
        opcoes={clientes.map((c) => ({ valor: c.id, texto: c.nome }))}
        valor={clienteId}
        aoSelecionar={setClienteId}
        textoVazio="Cadastre um cliente primeiro."
      />
      <Campo rotulo="Placa *" value={placa} onChangeText={setPlaca} placeholder="ABC1D23" autoCapitalize="characters" maxLength={8} />
      <Campo rotulo="Marca" value={marca} onChangeText={setMarca} placeholder="Ex.: Volkswagen" />
      <Campo rotulo="Modelo *" value={modelo} onChangeText={setModelo} placeholder="Ex.: Gol" />
      <Campo rotulo="Cor" value={cor} onChangeText={setCor} placeholder="Ex.: Prata" />

      <Botao
        titulo={editando ? 'Salvar alterações' : 'Cadastrar veículo'}
        icone="save-outline"
        carregando={salvando}
        onPress={salvar}
      />
    </ScrollView>
  );
}

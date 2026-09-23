import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Botao from './Botao';
import estilos from '../styles/estilos';
import cores from '../styles/cores';

// Primeira tela de cada Collection: dá acesso ao Cadastro e à Listagem.
// Os textos chegam por route.params (definidos em navigation/Pilhas.js).
export default function MenuColecao({ navigation, route }) {
  const { titulo, singular, icone, descricao } = route.params;

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <View style={styles.topo}>
        <View style={styles.circulo}>
          <Ionicons name={icone} size={44} color={cores.primaria} />
        </View>
        <Text style={estilos.titulo}>{titulo}</Text>
        <Text style={[estilos.subtitulo, { textAlign: 'center' }]}>{descricao}</Text>
      </View>

      <Botao
        titulo={`Cadastrar ${singular}`}
        icone="add-circle-outline"
        onPress={() => navigation.navigate('Cadastro')}
      />
      <Botao
        titulo="Listar / Alterar / Excluir"
        icone="list-outline"
        contorno
        style={{ marginTop: 12 }}
        onPress={() => navigation.navigate('Lista')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topo: {
    alignItems: 'center',
    marginVertical: 24,
  },
  circulo: {
    backgroundColor: cores.primariaClara,
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
});

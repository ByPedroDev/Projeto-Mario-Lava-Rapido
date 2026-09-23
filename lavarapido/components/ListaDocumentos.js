import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';

import estilos from '../styles/estilos';
import cores from '../styles/cores';

// Mostra carregando / erro / lista vazia / lista de itens.
// Usado pelas 5 telas de listagem para não repetir o mesmo código.
export default function ListaDocumentos({ itens, carregando, erro, textoVazio, renderItem, cabecalho }) {
  if (carregando) {
    return (
      <View style={[estilos.tela, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return (
    <FlatList
      style={estilos.tela}
      contentContainerStyle={estilos.conteudo}
      data={itens}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={cabecalho}
      ListEmptyComponent={
        erro ? (
          <Text style={estilos.textoErro}>Erro ao carregar: {erro}</Text>
        ) : (
          <Text style={estilos.textoVazio}>{textoVazio}</Text>
        )
      }
    />
  );
}

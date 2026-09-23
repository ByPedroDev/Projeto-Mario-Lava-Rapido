import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import estilos from '../styles/estilos';
import cores from '../styles/cores';

// Cartão de um item na listagem, com os botões Alterar e Excluir.
// linhas: textos extras mostrados embaixo do título. "destaque" é uma etiqueta opcional.
export default function ItemLista({ icone, titulo, linhas = [], destaque, corDestaque, aoAlterar, aoExcluir }) {
  return (
    <View style={estilos.cartao}>
      <View style={styles.topo}>
        <View style={styles.icone}>
          <Ionicons name={icone} size={22} color={cores.primaria} />
        </View>
        <Text style={styles.titulo}>{titulo}</Text>
        {destaque ? (
          <Text style={[styles.etiqueta, { backgroundColor: corDestaque || cores.primaria }]}>
            {destaque}
          </Text>
        ) : null}
      </View>

      {linhas.filter(Boolean).map((linha, i) => (
        <Text key={i} style={styles.linha}>{linha}</Text>
      ))}

      <View style={styles.acoes}>
        <TouchableOpacity style={styles.acao} onPress={aoAlterar}>
          <Ionicons name="create-outline" size={18} color={cores.primaria} />
          <Text style={[styles.textoAcao, { color: cores.primaria }]}>Alterar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acao} onPress={aoExcluir}>
          <Ionicons name="trash-outline" size={18} color={cores.perigo} />
          <Text style={[styles.textoAcao, { color: cores.perigo }]}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icone: {
    backgroundColor: cores.primariaClara,
    borderRadius: 20,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titulo: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: cores.texto,
  },
  etiqueta: {
    color: cores.branco,
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  linha: {
    color: cores.textoSuave,
    fontSize: 14,
    marginLeft: 48,
    marginTop: 2,
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    marginTop: 10,
    paddingTop: 8,
    gap: 20,
  },
  acao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  textoAcao: {
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

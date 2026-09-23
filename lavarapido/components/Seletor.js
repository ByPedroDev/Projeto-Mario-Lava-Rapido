import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import estilos from '../styles/estilos';
import cores from '../styles/cores';

// Escolha de uma opção entre várias (ex.: qual cliente é dono do veículo).
// opcoes: [{ valor: 'id', texto: 'Nome que aparece' }]
export default function Seletor({ rotulo, opcoes, valor, aoSelecionar, textoVazio = 'Nenhuma opção cadastrada.' }) {
  return (
    <View style={estilos.campoBox}>
      <Text style={estilos.rotulo}>{rotulo}</Text>

      {opcoes.length === 0 ? (
        <Text style={styles.vazio}>{textoVazio}</Text>
      ) : (
        <View style={styles.grade}>
          {opcoes.map((opcao) => {
            const selecionado = opcao.valor === valor;
            return (
              <TouchableOpacity
                key={opcao.valor}
                style={[styles.opcao, selecionado && styles.opcaoSelecionada]}
                onPress={() => aoSelecionar(opcao.valor)}
              >
                <Text style={[styles.textoOpcao, selecionado && styles.textoSelecionado]}>
                  {opcao.texto}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opcao: {
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.branco,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  opcaoSelecionada: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  textoOpcao: {
    color: cores.texto,
    fontSize: 14,
  },
  textoSelecionado: {
    color: cores.branco,
    fontWeight: 'bold',
  },
  vazio: {
    color: cores.textoSuave,
    fontStyle: 'italic',
  },
});

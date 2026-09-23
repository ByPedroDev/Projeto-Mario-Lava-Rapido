import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import cores from '../styles/cores';

// Botão padrão do app. "contorno" deixa o botão só com a borda colorida.
export default function Botao({ titulo, onPress, icone, cor = cores.primaria, contorno, carregando, style }) {
  const corTexto = contorno ? cor : cores.branco;

  return (
    <TouchableOpacity
      style={[
        styles.botao,
        contorno ? { borderColor: cor, borderWidth: 2 } : { backgroundColor: cor },
        carregando && { opacity: 0.7 },
        style,
      ]}
      onPress={onPress}
      disabled={carregando}
      activeOpacity={0.8}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <View style={styles.linha}>
          {icone && <Ionicons name={icone} size={20} color={corTexto} style={{ marginRight: 8 }} />}
          <Text style={[styles.texto, { color: corTexto }]}>{titulo}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  texto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

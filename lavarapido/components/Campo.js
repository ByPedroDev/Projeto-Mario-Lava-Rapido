import React from 'react';
import { View, Text, TextInput } from 'react-native';

import estilos from '../styles/estilos';

// Campo de formulário: rótulo + caixa de texto.
// Todas as outras props (value, onChangeText, keyboardType...) vão direto pro TextInput.
export default function Campo({ rotulo, ...props }) {
  return (
    <View style={estilos.campoBox}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput style={estilos.input} placeholderTextColor="#9AA8B3" {...props} />
    </View>
  );
}

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { firebaseConfigurado } from '../firebaseConfig';
import { ouvirColecao } from '../services/firestore';
import estilos from '../styles/estilos';
import cores from '../styles/cores';

// Atalhos da tela inicial: nome da tela no Drawer, Collection e campo para ordenar
const ATALHOS = [
  { tela: 'Clientes', colecao: 'clientes', ordem: 'nome', icone: 'people-outline' },
  { tela: 'Veiculos', rotulo: 'Veículos', colecao: 'veiculos', ordem: 'placa', icone: 'car-sport-outline' },
  { tela: 'Servicos', rotulo: 'Serviços', colecao: 'servicos', ordem: 'nome', icone: 'sparkles-outline' },
  { tela: 'Funcionarios', rotulo: 'Funcionários', colecao: 'funcionarios', ordem: 'nome', icone: 'id-card-outline' },
  { tela: 'Agendamentos', colecao: 'agendamentos', ordem: 'dataHoraOrdem', icone: 'calendar-outline' },
];

export default function Inicio({ navigation }) {
  // Quantidade de documentos em cada Collection, ex.: { clientes: 3 }
  const [totais, setTotais] = useState({});

  useEffect(() => {
    if (!firebaseConfigurado) return;
    const paradas = ATALHOS.map((a) =>
      ouvirColecao(a.colecao, a.ordem, (lista) =>
        setTotais((anterior) => ({ ...anterior, [a.colecao]: lista.length }))
      )
    );
    return () => paradas.forEach((parar) => parar());
  }, []);

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <View style={styles.banner}>
        <Ionicons name="water" size={40} color={cores.branco} />
        <Text style={styles.bannerTitulo}>Lava Rápido Gota Azul</Text>
        <Text style={styles.bannerTexto}>Sistema de gerenciamento do lava rápido</Text>
      </View>

      {!firebaseConfigurado && (
        <View style={styles.aviso}>
          <Ionicons name="warning-outline" size={22} color={cores.perigo} />
          <Text style={styles.avisoTexto}>
            Firebase ainda não configurado. Cole as credenciais do seu projeto no arquivo
            firebaseConfig.js para o sistema salvar os dados.
          </Text>
        </View>
      )}

      <Text style={[estilos.rotulo, { fontSize: 16, marginBottom: 10 }]}>Acesso rápido</Text>

      <View style={styles.grade}>
        {ATALHOS.map((a) => (
          <TouchableOpacity key={a.tela} style={styles.card} onPress={() => navigation.navigate(a.tela)}>
            <Ionicons name={a.icone} size={30} color={cores.primaria} />
            <Text style={styles.cardNumero}>{totais[a.colecao] ?? '–'}</Text>
            <Text style={styles.cardTexto}>{a.rotulo ?? a.tela}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: cores.primaria,
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerTitulo: {
    color: cores.branco,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  bannerTexto: {
    color: cores.primariaClara,
    fontSize: 14,
    marginTop: 4,
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  avisoTexto: {
    flex: 1,
    color: cores.perigo,
    fontSize: 14,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: cores.branco,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.borda,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  cardNumero: {
    fontSize: 26,
    fontWeight: 'bold',
    color: cores.texto,
    marginTop: 6,
  },
  cardTexto: {
    fontSize: 14,
    color: cores.textoSuave,
  },
});

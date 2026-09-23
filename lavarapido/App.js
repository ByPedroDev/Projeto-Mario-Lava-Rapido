import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import Inicio from './screens/Inicio';
import {
  PilhaClientes,
  PilhaVeiculos,
  PilhaServicos,
  PilhaFuncionarios,
  PilhaAgendamentos,
} from './navigation/Pilhas';
import cores from './styles/cores';

const Drawer = createDrawerNavigator();

// Itens do menu principal: uma opção para cada Collection do Firestore
const MENU = [
  { nome: 'Clientes', titulo: 'Clientes', icone: 'people-outline', componente: PilhaClientes },
  { nome: 'Veiculos', titulo: 'Veículos', icone: 'car-sport-outline', componente: PilhaVeiculos },
  { nome: 'Servicos', titulo: 'Serviços', icone: 'sparkles-outline', componente: PilhaServicos },
  { nome: 'Funcionarios', titulo: 'Funcionários', icone: 'id-card-outline', componente: PilhaFuncionarios },
  { nome: 'Agendamentos', titulo: 'Agendamentos', icone: 'calendar-outline', componente: PilhaAgendamentos },
];

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Drawer.Navigator
          initialRouteName="Inicio"
          screenOptions={{
            headerStyle: { backgroundColor: cores.primaria },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            drawerActiveTintColor: cores.primaria,
            drawerActiveBackgroundColor: cores.primariaClara,
            drawerInactiveTintColor: '#555',
            drawerLabelStyle: { fontSize: 15, fontWeight: 'bold' },
          }}
        >
          <Drawer.Screen
            name="Inicio"
            component={Inicio}
            options={{
              title: 'Início',
              drawerIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
            }}
          />

          {MENU.map((item) => (
            <Drawer.Screen
              key={item.nome}
              name={item.nome}
              component={item.componente}
              options={{
                title: item.titulo,
                // Quem mostra o topo é a Stack de cada Collection
                headerShown: false,
                drawerIcon: ({ color, size }) => <Ionicons name={item.icone} color={color} size={size} />,
              }}
            />
          ))}
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

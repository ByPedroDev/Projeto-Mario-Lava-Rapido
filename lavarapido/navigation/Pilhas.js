import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import MenuColecao from '../components/MenuColecao';
import CadastroCliente from '../screens/clientes/CadastroCliente';
import ListaClientes from '../screens/clientes/ListaClientes';
import CadastroVeiculo from '../screens/veiculos/CadastroVeiculo';
import ListaVeiculos from '../screens/veiculos/ListaVeiculos';
import CadastroServico from '../screens/servicos/CadastroServico';
import ListaServicos from '../screens/servicos/ListaServicos';
import CadastroFuncionario from '../screens/funcionarios/CadastroFuncionario';
import ListaFuncionarios from '../screens/funcionarios/ListaFuncionarios';
import CadastroAgendamento from '../screens/agendamentos/CadastroAgendamento';
import ListaAgendamentos from '../screens/agendamentos/ListaAgendamentos';
import cores from '../styles/cores';

const Pilha = createNativeStackNavigator();

// Cria a navegação Stack de uma Collection:
// Menu (Cadastrar | Listar)  ->  Cadastro  /  Lista  ->  Cadastro (para alterar)
function criarPilha({ titulo, singular, icone, descricao, TelaCadastro, TelaLista }) {
  return function PilhaColecao() {
    return (
      <Pilha.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: cores.primaria },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Pilha.Screen
          name="Menu"
          component={MenuColecao}
          initialParams={{ titulo, singular, icone, descricao }}
          options={({ navigation }) => ({
            title: titulo,
            // Botão que abre o menu lateral (Drawer)
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.getParent().openDrawer()} style={{ marginRight: 16 }}>
                <Ionicons name="menu" size={26} color="#fff" />
              </TouchableOpacity>
            ),
          })}
        />
        <Pilha.Screen
          name="Cadastro"
          component={TelaCadastro}
          // O mesmo formulário serve para cadastrar e para alterar
          options={({ route }) => ({
            title: route.params?.item ? `Alterar ${singular}` : `Cadastrar ${singular}`,
          })}
        />
        <Pilha.Screen name="Lista" component={TelaLista} options={{ title: `Lista de ${titulo}` }} />
      </Pilha.Navigator>
    );
  };
}

export const PilhaClientes = criarPilha({
  titulo: 'Clientes',
  singular: 'Cliente',
  icone: 'people-outline',
  descricao: 'Pessoas que trazem os veículos para lavar.',
  TelaCadastro: CadastroCliente,
  TelaLista: ListaClientes,
});

export const PilhaVeiculos = criarPilha({
  titulo: 'Veículos',
  singular: 'Veículo',
  icone: 'car-sport-outline',
  descricao: 'Carros e motos dos clientes, identificados pela placa.',
  TelaCadastro: CadastroVeiculo,
  TelaLista: ListaVeiculos,
});

export const PilhaServicos = criarPilha({
  titulo: 'Serviços',
  singular: 'Serviço',
  icone: 'sparkles-outline',
  descricao: 'Tipos de lavagem oferecidos, com preço e duração.',
  TelaCadastro: CadastroServico,
  TelaLista: ListaServicos,
});

export const PilhaFuncionarios = criarPilha({
  titulo: 'Funcionários',
  singular: 'Funcionário',
  icone: 'id-card-outline',
  descricao: 'Equipe responsável pelas lavagens e atendimento.',
  TelaCadastro: CadastroFuncionario,
  TelaLista: ListaFuncionarios,
});

export const PilhaAgendamentos = criarPilha({
  titulo: 'Agendamentos',
  singular: 'Agendamento',
  icone: 'calendar-outline',
  descricao: 'Horários marcados: cliente, veículo, serviço e funcionário.',
  TelaCadastro: CadastroAgendamento,
  TelaLista: ListaAgendamentos,
});

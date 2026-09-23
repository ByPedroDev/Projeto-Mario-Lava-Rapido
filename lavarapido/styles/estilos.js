import { StyleSheet } from 'react-native';
import cores from './cores';

// Estilos compartilhados pelas telas de cadastro e listagem
const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  // Limita a largura no navegador (Web) para o formulário não esticar demais
  conteudo: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: 16,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: cores.textoSuave,
    marginBottom: 16,
  },
  campoBox: {
    marginBottom: 14,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 6,
  },
  input: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: cores.texto,
  },
  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  textoVazio: {
    textAlign: 'center',
    color: cores.textoSuave,
    fontSize: 15,
    marginTop: 40,
  },
  textoErro: {
    textAlign: 'center',
    color: cores.perigo,
    fontSize: 15,
    marginTop: 40,
  },
});

export default estilos;

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexGrow: 1,
  },

  // 🔹 Cabeçalho
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4caf50',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
    textAlign: 'center',
  },

  // 🔹 Botão Adicionar
  addButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // 🔹 Botão Sair
  exitButton: {
    borderWidth: 1,
    borderColor: '#81c784',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  exitButtonText: {
    fontSize: 16,
    color: '#388e3c',
    fontWeight: '500',
    marginLeft: 8,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 12,
  },

  retryButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default styles;

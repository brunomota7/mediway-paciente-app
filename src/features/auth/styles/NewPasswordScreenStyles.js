import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#81c784',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  iconBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 10,
  },
  hint: {
    color: '#666',
    fontSize: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    color: '#1b5e20',
    textAlign: 'center',
    marginTop: 10,
  },
});

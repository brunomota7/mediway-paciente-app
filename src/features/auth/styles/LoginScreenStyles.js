import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  slogan: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#4caf50',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#81c784',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  iconBtn: {
    position: "absolute",
    right: 12,
    top: 8,
  },
  toggle: {
    textAlign: 'right',
    color: '#33691e',
    marginBottom: 10,
  },
  button: {
    width: "100%",
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    minWidth: '40%',
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    color: '#1b5e20',
    marginTop: 10,
  },
  socialButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  socialText: {
    color: '#333',
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 10,
  },
  expiredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff8e1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    width: '100%',
  },
  expiredText: {
    color: '#8d6e00',
    fontSize: 13,
    flexShrink: 1,
  },
});

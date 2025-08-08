import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // fundo semitransparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    flexShrink: 1,
  },
  message: {
    fontSize: 14,
    color: '#444',
    marginBottom: 16,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
    color: '#2e7d32',
  },
  boldDanger: {
    fontWeight: '600',
    color: '#d32f2f',
  },
  vaccineInfo: {
    marginBottom: 16,
    backgroundColor: '#f9fbe7',
    borderRadius: 8,
    padding: 12,
  },
  vaccineLabel: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
    marginTop: 6,
  },
  vaccineValue: {
    fontSize: 14,
    color: '#333',
  },
  buttonGroup: {
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default styles;

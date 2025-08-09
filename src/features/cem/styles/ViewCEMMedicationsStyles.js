// 📁 src/features/cem/styles/ViewCEMMedicationsStyles.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 5,
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  legendContainer: {
    marginBottom: 16,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  legendText: {
    fontSize: 14,
    marginLeft: 8,
    color: '#444',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 12,
  },

  cell: {
    width: '30%',
    aspectRatio: 1, // mantém a célula quadrada
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    padding: 6,
  },

  cellLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 6,
    color: '#333',
  },

  medName: {
    fontSize: 11,
    color: '#4caf50',
    textAlign: 'center',
    marginTop: 2,
  },

  explanation: {
    marginTop: 20,
    marginBottom: 20,
  },

  explanationText: {
    fontSize: 13,
    color: '#555',
    marginVertical: 2,
  },

  backButton: {
    minWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#388e3c',
  },

  backButtonText: {
    fontSize: 14,
    color: '#388e3c',
    marginLeft: 8,
  },
});

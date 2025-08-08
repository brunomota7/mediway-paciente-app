// 📁 src/features/cem/styles/AddCEMScreenStyles.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4caf50',
    marginLeft: 10,
  },

  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    marginLeft: 34,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
    color: '#4caf50',
  },

  card: {
    backgroundColor: '#f3fef4',
    borderWidth: 1,
    borderColor: '#c8e6c9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },

  serieText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4caf50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  addButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },

  backButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },

  backButtonText: {
    color: '#388e3c',
    fontSize: 16,
    marginLeft: 6,
    fontWeight: '500',
  },
});

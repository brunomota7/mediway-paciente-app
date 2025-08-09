// 📁 src/features/medications/styles/MedicationListScreenStyles.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  header: {
    alignItems: 'center',
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginTop: 5,
  },
  contentContainer: {
    flex: 1,
  },
  tabView: {
    width: '100%',
    flex: 1,
  },
  areaBtnInferiores: {
    padding: 8,
    gap: 8,
  },
  addButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exitButton: {
    borderWidth: 1,
    borderColor: '#4caf50',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  exitButtonText: {
    color: '#388e3c',
    fontSize: 15,
    fontWeight: '600',
  },
});

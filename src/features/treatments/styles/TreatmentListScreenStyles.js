// 📁 src/features/treatments/styles/TreatmentListScreenStyles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderColor: '#c8e6c9',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardField: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
  fieldLabel: {
    fontWeight: '600',
    color: '#4caf50',
  },
  exitButton: {
    marginTop: 8,
    borderColor: '#81c784',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitButtonText: {
    color: '#388e3c',
    fontSize: 16,
    fontWeight: '500',
  },
  fixedButtons: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: '#ffffff',
  },
});

export default styles;

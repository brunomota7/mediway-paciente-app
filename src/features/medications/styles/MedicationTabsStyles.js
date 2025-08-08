// 📁 src/features/medications/styles/MedicationTabsStyles.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  tabContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },

  indicator: {
    backgroundColor: '#4caf50',
    height: 3,
  },

  activeTab: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 14,
  },

  inactiveTab: {
    color: '#999',
    fontSize: 14,
  },

  tabView: {
    width: '100%',
    backgroundColor: '#f9f9f9',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },

  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },

  refText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 4,
  },

  text: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },

  // Badge de status (cor dinâmica)
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
    minWidth: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },

  suspBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fdecea',
    borderRadius: 8,
  },

  suspText: {
    flex: 1,
    fontSize: 14,
    color: '#d32f2f',
    marginLeft: 8,
  },

  histBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: 'space-between',
  },

  histText: {
    flex: 1,
    marginLeft: 8,
    color: '#388e3c',
    fontSize: 14,
  },

  link: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e88e5',
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
});

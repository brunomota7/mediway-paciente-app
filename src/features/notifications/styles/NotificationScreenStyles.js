// 📁 src/features/notifications/styles/NotificationScreenStyles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 16,
    paddingBottom: 96,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    flex: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 16,
  },
  filterButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderColor: '#c8e6c9',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  cardDate: {
    color: '#777',
    fontSize: 12,
  },
  badgeNew: {
    marginLeft: 'auto',
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeNewText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  cardType: {
    fontSize: 13,
    color: '#4caf50',
    fontWeight: '600',
    marginTop: 2,
  },
  cardMessage: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
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
});

export default styles;

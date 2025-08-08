import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  menuIcon: {
    fontSize: 28,
    color: '#2e7d32',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 60,
    marginBottom: 20,
    textAlign: 'center',
  },
  dashboard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 12,
    width: '30%',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    backgroundColor: '#f1f8e9',
    padding: 16,
    borderRadius: 12,
    width: '47%',
    marginBottom: 15,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    backgroundColor: '#ffffffaa',
    padding: 10,
    borderRadius: 30,
  },
  footerIcon: {
    fontSize: 24,
    color: '#4caf50',
  },
});
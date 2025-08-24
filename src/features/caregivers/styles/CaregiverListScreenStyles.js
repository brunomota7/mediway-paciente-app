import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  header: {
    marginBottom: 12,
    alignItems: 'center',
  },
  patientName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2e7d32',
  },
  patientSubtitle: {
    fontSize: 14,
    color: '#b39ddb',
  },
  patientRole: {
    fontSize: 14,
    color: '#9575cd',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 8,
    color: '#4caf50',
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 8,
    color: '#ab47bc',
  },
  sectionTitleGreen: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4caf50',
    marginBottom: 8,
  },
  sectionTitleLavender: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9575cd',
    marginBottom: 8,
  },
  grid: {
    gap: 8,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardGrid: {
    gap: 12,
    paddingVertical: 8,
  },
  card: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#c8e6c9',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  cardRole: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 6,
  },
  deleteButton: {
    backgroundColor: '#e53935',
    borderRadius: 20,
    padding: 4,
    position: 'absolute',
    top: 6,
    right: 6,
  },
  addButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    marginTop: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#c8e6c9',
    marginVertical: 16,
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
    backgroundColor: '#fff',
  },
  exitButtonText: {
    color: '#388e3c',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default styles;

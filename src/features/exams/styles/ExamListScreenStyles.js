// 📄 src/features/exams/styles/ExamListScreenStyles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4caf50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  exitButton: {
    borderWidth: 1,
    borderColor: '#a5d6a7',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    color: '#388e3c',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default styles;

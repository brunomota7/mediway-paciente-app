// 📁 src/features/caregivers/styles/AddCaregiverModalStyles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
},
header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
},
headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
},
title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginLeft: 8,
},
closeButton: {
    padding: 8,
},
infoBox: {
    borderLeftWidth: 4,
    borderColor: '#ba68c8',
    backgroundColor: '#f3e5f5',
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
},
infoIcon: {
    marginRight: 8,
},
infoText: {
    color: '#555',
    fontSize: 14,
    flex: 1,
},
label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
},
pickerWrapper: {
    borderWidth: 1,
    borderColor: '#c8e6c9',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
},
detailsBox: {
    marginTop: 10,
    backgroundColor: '#f1f8e9',
    padding: 12,
    borderRadius: 8,
},
detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
},
buttonPrimary: {
    marginTop: 24,
    backgroundColor: '#4caf50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
},
buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
},
buttonSecondary: {
    marginTop: 16,
    borderColor: '#81c784',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
},
buttonSecondaryText: {
    color: '#388e3c',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 6,
},
});

export default styles;
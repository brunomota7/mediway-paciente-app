// 📁 src/features/home/styles/HomeScreenStyles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'flex-start'
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  menuButton: {
    alignSelf: 'flex-start',
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#2e7d32',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2e7d32',
    textAlign: 'center',
  },
  logo: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  subLogoText: {
    fontSize: 14,
    color: '#ab47bc',
    textAlign: 'center',
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2e7d32',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  dashboardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  dashboardCard: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1b5e20',
    textAlign: 'center',
  },
  curvedTabBar: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    marginHorizontal: '5%',
    elevation: 10,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
  },
});

export default styles;

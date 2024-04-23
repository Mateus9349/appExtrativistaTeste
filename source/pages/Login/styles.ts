import { StyleSheet } from 'react-native';
import { theme } from '../../../utils/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
    paddingTop: 16
  },
  contentTitle: {
    fontSize: 19,
    lineHeight: 24,
    fontFamily: theme.font.archivo_bold,
    color: theme.colors.brown_dark,
    marginBottom: 60,
    marginTop: 32
  },
  registerButtonContainer: {
    alignSelf: 'center', 
    width: '100%', 
    alignItems: 'center', 
    marginTop: 38
  },
  registerButton: {
    width: 110, 
    alignSelf: "center", 
    borderBottomColor: '#000', 
    borderBottomWidth: 2
  }

});
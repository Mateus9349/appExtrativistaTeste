import { StyleSheet } from 'react-native';
import { theme } from '../../../utils/theme';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
    color: theme.colors.white,
    fontFamily: theme.font.bw_regular,
    fontWeight: '700',
    fontSize: 42,
    lineHeight: 56,
  }
});
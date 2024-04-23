import React from 'react';
import { TextProps, Text, StyleProp, TextStyle } from 'react-native';

interface Props extends TextProps {
    children:  React.ReactNode
    styles: StyleProp<TextStyle>
}

export function CustomText({ children, styles, ...rest }: Props) {
  return (
    <Text style={[styles, { alignSelf: 'stretch' }]} {...rest}>
      {children}
    </Text>
  );
}
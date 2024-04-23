import React from 'react';
import { Input as NativeInput } from 'native-base'
import { theme } from '../../../utils/theme';

interface Props {
  placeholder: string
  state: string
  setState: React.Dispatch<React.SetStateAction<string>>
}

export function CustomInput(props: Props) {
  return (
    <NativeInput
        bg={theme.colors.grayscale[100]}
        placeholder={props.placeholder}
        style={{ fontSize: 17 }}
        borderRadius={'16px'}
        w={'100%'}
        h={'50px'}
        placeholderTextColor={theme.colors.grayscale[500]}
        value={props.state}
        onChangeText={props.setState}
        returnKeyType="done"
    />
  );
}
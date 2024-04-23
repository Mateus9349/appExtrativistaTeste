import { HStack, Text } from 'native-base';
import React from 'react';
import { theme } from '../../../utils/theme';
import { MaskedTextInput, MaskedTextInputProps } from 'react-native-mask-text';

interface Props extends MaskedTextInputProps {
    label: string
    Icon?: React.ElementType
}

export function HorizontalInput({ label, Icon, ...rest }: Props) {

    return (
        <HStack mx={3} mt={8} h={'48px'} alignItems={'center'}>
            {Icon ?
                <Icon />
                :
                null
            }
            <Text
                fontSize={19}
                fontFamily={theme.font.basicSans_regular}
                lineHeight={24}
                mr={3}
                ml={2}
            >
                {label}
            </Text>
            <MaskedTextInput
                style={{ 
                    color: "#000", 
                    fontSize: 19, 
                    textAlign: 'left',
                    height: 48,
                    flex: 1,
                    paddingHorizontal: 6, 
                    paddingVertical: 13,
                    borderRadius: 10, 
                    backgroundColor: theme.colors.grayscale[100]
                }}
                {...rest}
            />
        </HStack>
    );
}
import { Button, Text } from 'native-base';
import { FontAwesome5 as FIcon } from '@expo/vector-icons'
import React from 'react';
import { theme } from '../../../utils/theme';

interface Props {
    buttonColor: string
    icon: string
    title: string
    onPress: () => void
}


export function ButtonWithBottomIcon({ buttonColor, icon, title, onPress }: Props) {

    const color = buttonColor === theme.colors.green_dark ? "#fff" : '#000'

    return (
        <Button
            onPress={onPress}
            colorScheme={'success'}
            w={164} 
            h={'80px'} 
            borderRadius={16} 
            bg={buttonColor}
            flex={1}
            mx={2}
        >
            <Text fontFamily={theme.font.basicSans_regular} mb={1} fontSize={17} color={color}>{title}</Text>
            <FIcon style={{ alignSelf: 'center' }} name={icon} color={color} size={24}/>
        </Button>
    );
}
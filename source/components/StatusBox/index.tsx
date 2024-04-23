import React from 'react';
import { View } from 'react-native';
import { FontAwesome5 as Icon} from '@expo/vector-icons'; 

import { styles } from './styles';
import { theme } from '../../../utils/theme';
import { HStack, VStack } from 'native-base';
import { CustomText } from '../CustomText';


export function StatusBox() {
  return (
    <HStack
        bg={theme.colors.green_light}
        borderRadius={10}
        paddingX={'16px'}
        alignItems={'center'}
        justifyContent={'center'}
        h={'80px'}
        mt={'16px'}
        shadow={3}
    >
        <Icon 
            name="check-circle"
            color={theme.colors.green_regular}
            size={40}
        />
        <VStack flex={1} marginLeft={'16px'}>
            <CustomText styles={{ fontSize: 19, fontFamily: theme.font.archivo_bold }}>
                Conectado ao servidor
            </CustomText>
            <CustomText styles={{ fontSize: 12, fontFamily: theme.font.archivo_regular }}>
                Dados atualizados
            </CustomText>
        </VStack>
    </HStack>
  );
}
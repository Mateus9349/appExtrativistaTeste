import React from 'react';
import { View } from 'react-native';
import { Entypo, FontAwesome5 as FIcon } from '@expo/vector-icons'
import { HStack, Box, VStack } from 'native-base';
import { CustomText } from '../CustomText';
import moment from 'moment'
import 'moment/locale/pt-br'
import { theme } from '../../../utils/theme';

//dots-three-vertical

interface Props {
    quantity: number
    name: string
    endDate: string
    sufix: string
}


export function CollectCard({ endDate, name, quantity, sufix }: Props) {

    const title = quantity + ' ' + sufix + ' ' + name
    const date =  moment(endDate, 'DD/MM/YYYY').format("DD / MMMM")

    var dayWithBar = date.split(" ")[0] + ' ' + date.split(' ')[1] + ' '
    var month = date.split(' ')[2].split('')[0].toUpperCase() + date.split(' ')[2].substring(1)

    const colors = [
        { iconColor: theme.colors.brown_dark, bg: theme.colors.brown_super_light },
        { iconColor: theme.colors.green_dark, bg: theme.colors.green_light },
        { iconColor: theme.colors.grayscale[900], bg: theme.colors.yellow_light },
    ]
    const randomIndex = Math.floor(Math.random() * 3)


    return (
        <HStack w={336} alignSelf={'center'} my={4}>
            <Box w={'64px'} h={'64px'} bg={colors[randomIndex].bg}  alignItems={'center'} justifyContent={'center'} borderRadius={5}>
                <FIcon name='apple-alt' size={28} color={colors[randomIndex].iconColor}/>
            </Box>
            <VStack flex={1} justifyContent={'center'} space={1} paddingLeft={3}>
                <CustomText styles={{ fontSize: 19, fontFamily: theme.font.basicSans_bold }}>
                    {title}
                </CustomText>
                <CustomText styles={{ fontSize: 17, fontFamily: theme.font.basicSans_regular }}>
                    {dayWithBar + month}
                </CustomText>
            </VStack>
        </HStack>
    );
}
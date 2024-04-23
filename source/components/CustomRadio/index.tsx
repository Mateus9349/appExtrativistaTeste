import { Radio, Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import { theme } from '../../../utils/theme';

interface Props {
    title: string
    data: RadioDataType[]
    setValue: React.Dispatch<React.SetStateAction<string>>
}

type RadioDataType = {
    value: string
    label: string
}

export function CustomRadio({ data, setValue, title }: Props) {
  return (
    <>
        <Text
            fontFamily={theme.font.basicSans_bold}
            fontSize={19}
            lineHeight={24}
            color={theme.colors.grayscale[900]}
            mb={3}
        >
            {title}
        </Text>
        <Radio.Group
            onChange={(value) => {setValue(value); console.log(value)}}
            name='test'
        >
            {data.map((item) => {
                return (
                    <Radio key={item.value} value={item.value} my={2}>
                        {item.label}
                    </Radio>
                )
            })

            }
        </Radio.Group>
    </>
  );
}
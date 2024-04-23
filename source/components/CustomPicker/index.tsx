import React from "react";
import { Platform } from "react-native";

import { styles } from "./styles";
import { Picker } from "@react-native-picker/picker";
import {
  CheckIcon,
  FormControl,
  HStack,
  Select,
  Text,
  WarningOutlineIcon,
} from "native-base";
import { CustomText } from "../CustomText";
import { theme } from "../../../utils/theme";

interface Props {
  title: string;
  placeholder?: string;
  items: Item[];
  state: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export type Item = {
  label: string;
  value: string | null;
};

const plataform = Platform.OS;

export function CustomPicker(props: Props) {
  return (
    <HStack
        borderRadius={16}
        my={3}
        bg={theme.colors.grayscale[100]}
        px={"8px"}
    >
        <Text 
            fontSize={17}
            mt={4}
            flex={1}
        >
            {props.title}
        </Text>
        <Select
            h={60}
            alignItems={'center'}
            justifyContent={'center'}
            fontSize={15}
            borderWidth={0}
            flex={1}
            accessibilityLabel={props.placeholder}
            placeholder={props.placeholder}
            onValueChange={itemValue => props.setValue(itemValue)}
            _selectedItem={{
                bg: "teal.600",
            }}
        >
            {props.items.map((item) => {
            return (
                <Select.Item
                label={item.label}
                value={item.value!}
                key={item.value}
                />
            );
            })}
        </Select>
    </HStack>
  );
}

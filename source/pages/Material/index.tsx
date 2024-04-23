import React from 'react';
import { View, Image } from 'react-native';
import { CustomText } from '../../components/CustomText';
import { Header } from '../../components/Header';
import { theme } from '../../../utils/theme';
import { PlusButton } from '../../components/PlusButton';
import { Box } from 'native-base';


export function Material() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff"  }}>

      <Header />
      <CustomText
        styles={{
          fontSize: 28,
          fontFamily: theme.font.bw_bold,
          lineHeight: 40,
          marginTop: 16,
          marginLeft: 20
        }}
      >
        Materiais
      </CustomText>

      <Box justifyItems={"center"} alignItems={"center"} mt={88} mb={10}>
        <Image
          source={require("../../../assets/leafs.png")}
          style={{ width: 96, height: 96, marginBottom: 16 }}
        />

        <CustomText
          styles={{ textAlign: "center", fontSize: 21, marginTop: 10 }}
        >
          Você não possui equipamentos
        </CustomText>
      </Box>

      <PlusButton title="Novo material" onPress={() => {}} />

    </View>
  );
}
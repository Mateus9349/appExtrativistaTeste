import React, { useEffect } from "react";
import { View, Image, SectionList } from "react-native";
import { CustomText } from "../../../components/CustomText";
import { Header } from "../../../components/Header";
import { Box, HStack, ScrollView } from "native-base";
import { theme } from "../../../../utils/theme";
import { PlusButton } from "../../../components/PlusButton";
import { ProgressBar } from "../../../components/ProgressBar";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CollectStackParams } from "..";
import { collectData } from '../../../../utils/collectMockData'
import { CollectCard } from "../../../components/CollectCard";


type collectScreenProp = NativeStackNavigationProp<CollectStackParams, 'HomeCollect'>;


export function CollectHome() {

  const navigation = useNavigation<collectScreenProp>()


  navigation.addListener("focus", () => {

    navigation.getParent()?.setOptions({
      tabBarStyle: {
        height: 90,
        paddingHorizontal: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 16,
      },
    });
  })

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      
        <Header />
      

      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomText
          styles={{
            fontSize: 28,
            fontFamily: theme.font.bw_bold,
            lineHeight: 40,
            marginTop: 16,
            marginLeft: 20,
          }}
        >
          Minhas coletas
        </CustomText>

        {collectData.length === 0 && (
          <Box justifyItems={"center"} alignItems={"center"} mt={88} mb={10}>
            <Image
              source={require("../../../../assets/leafs.png")}
              style={{ width: 96, height: 96, marginBottom: 16 }}
            />

            <CustomText
              styles={{ textAlign: "center", fontSize: 21, marginTop: 10 }}
            >
              Você não possui coletas
            </CustomText>
          </Box>
          ) 
        }

        <Box my={6}>
          <PlusButton title="Nova Coleta" onPress={() => navigation.navigate('NewCollect')} />
        </Box>

        <SectionList
          showsVerticalScrollIndicator={false} 
          scrollEnabled={false}
          sections={collectData}
          contentContainerStyle={{ marginHorizontal: 10, paddingBottom: 46, marginBottom: 36 }}
          ItemSeparatorComponent={() => (
            <Box w={300} borderBottomWidth={1} borderWidth={0} borderBottomColor={"#000"} alignSelf={'center'} opacity={0.2}/>
          )}
          renderItem={({ item }) => {
            return (
              <CollectCard 
                endDate={item.endDate}
                name={item.name}
                quantity={item.quantity}
                sufix={item.sufix}
              />
            )
          }}
          renderSectionHeader={({ section: { year } }) => {
            return (
              <CustomText styles={{ fontSize: 17, lineHeight: 24, fontFamily: theme.font.basicSans_regular, color: theme.colors.grayscale[500] }}>
                {year}
              </CustomText>
            )
          }}
        />
      </ScrollView>
      
      
    </View>
  );
}

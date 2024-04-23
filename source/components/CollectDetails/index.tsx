import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { SoldCollects } from "../../contexts/CollectInProgressContext";
import {
  Box,
  HStack,
  ScrollView,
  Text,
  VStack,
  useContrastText,
} from "native-base";
import { theme } from "../../../utils/theme";
import { Person, PersonType } from "../../../models/Person";
import { FeedStockIconRender } from "../FeedStockIconRender";
import { feedstockIcons } from "../../../utils/feedstockData";
import { FontAwesome5 as Icon } from "@expo/vector-icons";
import moment from "moment";
import { Sale } from "../../../models/Sale";
import { AuthContext } from "../../contexts/AuthContext";

interface Props {
  collect: SoldCollects;
}

export function CollectDetails({ collect }: Props) {
  const [helpers, setHelpers] = useState<PersonType[] | null>(null);
  const { user } = useContext(AuthContext);

  const [totalInkg, setTotalInKg] = useState(0);
  const [soldValue, setSoldValue] = useState(0);
  const [profit, setProfit] = useState(0);

  const transportTotal =
    (collect?.balsaExpenses ?? 0) +
    (collect?.boatExpenses ?? 0) +
    (collect?.rabetaExpenses ?? 0) +
    (collect?.otherExpenses ?? 0);

  const totalExpenses =
    transportTotal +
    collect.materialPerDayExpenses +
    (collect?.foodExpenses ?? 0);

  const getTeam = async () => {
    const collectTeam = JSON.parse(collect.team) as string[];

    const peopleInCollect = await Promise.all(
      collectTeam.map(async (personId) => {
        const helper = await Person.findAll({
          where: {
            id: personId,
          },
        });

        return helper;
      })
    );

    const fixedArray = peopleInCollect.map((item) => {
      return item[0];
    });

    if (!peopleInCollect) return;
    setHelpers(fixedArray);
  };

  const getTotalKg = async () => {
    if (collect.status === "sold") {
      const total = await Sale.findOne({
        where: {
          collectId: collect.id,
          userIdCreated: user?.id as string,
        },
        attributes: ["soldWeight", "saleValue", "profit"],
      });

      if (!total) return;

      setTotalInKg(total.soldWeight);
      setSoldValue(total.saleValue);
      setProfit(total.profit);
    }
  };

  useEffect(() => {
    getTeam();
    getTotalKg();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 56 }}
    >
      <Box alignItems={"center"}>
        <Text
          fontFamily={theme.font.bernhard_bold}
          fontSize={32}
          color={theme.colors.grayscale[900]}
        >
          Dados da coleta
        </Text>
      </Box>

      <VStack pl={6}>
        <VStack my={2}>
          <Text fontFamily={theme.font.basicSans_regular} fontSize={17} mb={2}>
            Matéria-prima
          </Text>
          <HStack>
            <FeedStockIconRender
              icon={
                feedstockIcons[
                  collect.feedstock.name as keyof typeof feedstockIcons
                ]
              }
              width={32}
              height={32}
            />
            <Text fontFamily={theme.font.bernhard_regular} fontSize={22} ml={2}>
              {collect.feedstock.name}
            </Text>
          </HStack>
        </VStack>
        <VStack my={2}>
          <Text fontFamily={theme.font.basicSans_regular} fontSize={17} mb={2}>
            {collect.status === "closed"
              ? "Quantidade coletada"
              : "Peso líquido total"}
          </Text>
          <HStack alignItems={"center"}>
            <Icon name="balance-scale" size={24} />
            <Text fontFamily={theme.font.bernhard_regular} fontSize={22} ml={2}>
              {collect.status === "closed"
                ? collect.quantity + " kg"
                : totalInkg + " kg"}
            </Text>
          </HStack>
        </VStack>
        {collect.status === "sold" && (
          <VStack my={2}>
            <Text
              fontFamily={theme.font.basicSans_regular}
              fontSize={17}
              mb={2}
            >
              Valor da venda
            </Text>
            <HStack alignItems={"center"} mb={3}>
              <Icon name="chart-line" size={24} />
              <Text
                fontFamily={theme.font.bernhard_regular}
                fontSize={22}
                ml={2}
              >
                R$ {soldValue}
              </Text>
            </HStack>
            <Text fontSize={16}>
              Você lucrou
              {
                <Text
                  color={theme.colors.green_dark}
                  fontFamily={theme.font.bernhard_bold}
                  fontSize={18}
                >
                  {" "}
                  {profit}{" "}
                </Text>
              }
              reais com essa coleta!
            </Text>
          </VStack>
        )}
        <VStack my={2}>
          <Text fontFamily={theme.font.basicSans_regular} fontSize={17} mb={2}>
            Ajudantes
          </Text>
          <HStack>
            <Icon name="users" size={24} />
            <Text fontFamily={theme.font.bernhard_regular} fontSize={22} ml={2}>
              {helpers
                ? helpers?.map(({ name }) => {
                    return name + ", ";
                  })
                : "Nenhum selecionado"}
            </Text>
          </HStack>
        </VStack>
        <VStack my={2}>
          <Text fontFamily={theme.font.basicSans_regular} fontSize={17} mb={2}>
            Período
          </Text>
          <HStack>
            <Icon name="calendar-alt" size={24} />
            <Text fontFamily={theme.font.bernhard_regular} fontSize={22} ml={2}>
              {moment(collect.created_at).format("DD/MM/YY") +
                " - " +
                moment(collect.closedDate).format("DD/MM/YY")}
            </Text>
          </HStack>
        </VStack>
        <VStack my={2}>
          <Text fontFamily={theme.font.basicSans_regular} fontSize={17} mb={2}>
            Gastos totais
          </Text>
          <HStack alignItems={"center"}>
            <Text fontFamily={theme.font.bernhard_bold} fontSize={24}>
              R$:
            </Text>
            <Text fontFamily={theme.font.bernhard_regular} fontSize={22} ml={2}>
              {totalExpenses}
            </Text>
          </HStack>
        </VStack>
      </VStack>

      <HStack
        bg={
          collect.status === "closed"
            ? theme.colors.brown_super_light
            : theme.colors.green_light
        }
        alignSelf={"center"}
        mt={3}
        w={200}
        h={"40px"}
        borderRadius={10}
        alignItems={"center"}
        justifyContent={"center"}
        borderWidth={1}
        borderColor={theme.colors.brown_dark}
      >
        <Text fontFamily={theme.font.basicSans_bold} fontSize={18}>
          {collect.status === "closed" ? "Em estoque" : "Coleta vendida"}
        </Text>
      </HStack>
    </ScrollView>
  );
}

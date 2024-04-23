import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { View } from "react-native";
import { Collect, CollectInterface } from "../../models/Collect";
import { Feedstock, FeedstockInterface } from "../../models/Feedstock";
import { SingleCollect } from "../../models/SingleCollect";
import { Op } from "rn-sequelize";
import { Sale } from "../../models/Sale";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";

interface Props {
  children: ReactNode;
}

interface IContext {
  collectInProgress: CollectInterface | null;
  setCollectInProgress: React.Dispatch<
    React.SetStateAction<CollectInterface | null>
  >;
  feedstockInCollect: FeedstockInterface | null;
  setFeedstockInCollect: React.Dispatch<
    React.SetStateAction<FeedstockInterface | null>
  >;
  hasCollectOpen: boolean;
  setHasCollectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allSoldCollects: SoldCollects[] | null;
  getAllCollects: () => void;
  totalEarnings: number;
  totalProduction: number;
  checkCollectInProgress: () => void;
}

export interface SoldCollects extends CollectInterface {
  feedstock: FeedstockInterface;
  quantity: number;
}

export const CollectInProgressContext = createContext<IContext>({} as IContext);

export const CollectInProgressProvider = ({ children }: Props) => {
  const { user } = useContext(AuthContext);

  const [collectInProgress, setCollectInProgress] =
    useState<CollectInterface | null>(null);
  const [feedstockInCollect, setFeedstockInCollect] =
    useState<FeedstockInterface | null>(null);
  const [hasCollectOpen, setHasCollectOpen] = useState(false);
  const [allSoldCollects, setAllSoldCollects] = useState<SoldCollects[] | null>(
    null
  );
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalProduction, setTotalProduction] = useState(0);

  const checkCollectInProgress = async () => {
    const collectInProgress = await AsyncStorage.getItem("collect-in-progress");
    var checkCollect = {} as CollectInterface;
    if (collectInProgress) {
      checkCollect = JSON.parse(collectInProgress);
    }

    console.log("async collect -> ", collectInProgress);

    if (!collectInProgress) {
      try {
        const collect = (await Collect.findOne({
          where: {
            status: "open",
            deleted_at: null,
            userIdCreated: user?.id as string,
          },
        })) as CollectInterface;

        console.log("Collect in progress -> ", collect);

        if (!collect) {
          setCollectInProgress(null);
          setFeedstockInCollect(null);
          setHasCollectOpen(false);
          await AsyncStorage.removeItem("collect-in-progress");
          return;
        }

        getFeedstockInCollect(collect.feedstockId);
        setCollectInProgress(collect);
        const collectLocalStorage = JSON.stringify(collect);
        await AsyncStorage.setItem("collect-in-progress", collectLocalStorage);
        return;
      } catch (error) {
        console.log("context collect error  -> ", error);
      }
    }

    const collectData = JSON.parse(collectInProgress!) as CollectInterface;

    getFeedstockInCollect(collectData.feedstockId);
    setCollectInProgress(collectData);
  };

  const getAllCollects = async () => {
    try {
      const collects: CollectInterface[] = await Collect.findAll({
        where: {
          deleted_at: null,
          userIdCreated: user?.id,
          [Op.or]: [{ status: "closed" }, { status: "sold" }],
        },
        order: [["created_at", "DESC"]],
      });

      if (!collects) return;

      var totalEarnings = 0;
      var totalProduction = 0;

      const collectWithFeedstock = await Promise.all(
        collects.map(async (item) => {
          const feedstockFromDb = (await Feedstock.findOne({
            where: {
              id: item.feedstockId,
              deleted_at: null,
            },
          })) as FeedstockInterface;

          const totalCollected = await SingleCollect.findAll({
            where: {
              collectId: item.id,
              userIdCreated: user?.id as string,
            },
            order: [["created_at", "desc"]],
            attributes: ["quantity"],
          });

          if (item.status === "sold") {
            const value = await Sale.findOne({
              where: {
                collectId: item.id,
                userIdCreated: user?.id as string,
              },
              attributes: ["profit", "soldWeight"],
            });
            totalEarnings = totalEarnings + value.profit;
            totalProduction = totalProduction + value.soldWeight;
          }

          if (totalEarnings > 0) {
            setTotalEarnings(totalEarnings);
            setTotalProduction(totalProduction);
          }

          let totalQuantity = 0;
          totalCollected.map((item: { quantity: number }) => {
            totalQuantity = totalQuantity + item.quantity;
          });

          const collectFeedstock = {
            id: item.id,
            team: item.team,
            foodExpenses: item.foodExpenses,
            boatExpenses: item.boatExpenses,
            rabetaExpenses: item.rabetaExpenses,
            otherExpenses: item.otherExpenses,
            balsaExpenses: item.balsaExpenses,
            materialPerDayExpenses: item.materialPerDayExpenses,
            status: item.status,
            created_at: item.created_at,
            feedstock: feedstockFromDb,
            quantity: totalQuantity,
            closedDate: item.closedDate,
            materialExpensesTotal: item.materialExpensesTotal,
          };

          return collectFeedstock as SoldCollects;
        })
      );

      if (collectWithFeedstock.length === 0) return;
      setAllSoldCollects(collectWithFeedstock as SoldCollects[]);
    } catch (error) {
      console.log("erro ao puxar coletas vendidas ->", error);
    }
  };

  const getFeedstockInCollect = async (feedstockId: string) => {
    try {
      const feedstock = (await Feedstock.findOne({
        where: {
          id: feedstockId,
        },
      })) as FeedstockInterface;

      if (!feedstock) return null;

      setFeedstockInCollect(feedstock);
    } catch (error) {
      console.log("Get feedstock in collect error -> ", error);
    }
  };

  useEffect(() => {
    if (user) {
      checkCollectInProgress();
      getAllCollects();
    }
  }, [hasCollectOpen, user]);

  return (
    <CollectInProgressContext.Provider
      value={{
        collectInProgress,
        setCollectInProgress,
        feedstockInCollect,
        setFeedstockInCollect,
        hasCollectOpen,
        setHasCollectOpen,
        allSoldCollects,
        getAllCollects,
        totalEarnings,
        totalProduction,
        checkCollectInProgress,
      }}
    >
      {children}
    </CollectInProgressContext.Provider>
  );
};

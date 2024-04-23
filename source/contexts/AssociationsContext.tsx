import React, {
  FunctionComponent,
  ReactNode,
  SVGAttributes,
  createContext,
  useState,
} from "react";

import ApadritSelected from "../../assets/ApadritSelected.svg";
import ApadritUnselected from "../../assets/ApadritUnselected.svg";
import ApfovSelected from "../../assets/ApfovSelected.svg";
import ApfovUnselected from "../../assets/ApfovUnselected.svg";
import AsagaSelected from "../../assets/AsagaSelected.svg";
import AsagaUnselected from "../../assets/AsagaUnselected.svg";
import AspacsSelected from "../../assets/AspacsSelected.svg";
import AspacsUnselected from "../../assets/AspacsUnselected.svg";
import UatumaSelected from "../../assets/UatumaSelected.svg";
import UatumaUnselected from "../../assets/UatumaUnselected.svg";

import GuestSelected from "../../assets/GuestSelected.svg";
import { SvgProps } from "react-native-svg";
import { ImageSourcePropType } from "react-native";

export interface IAssociationsContext {
  associationData: associationData[];
  categoryData: categoryData[];
  association: number | null;
  setAssociation: React.Dispatch<React.SetStateAction<number | null>>;
  category: number | null;
  setCategory: React.Dispatch<React.SetStateAction<number | null>>;
}

export const AssociationContext = createContext<IAssociationsContext>(
  {} as IAssociationsContext
);

interface Props {
  children: ReactNode;
}

type associationData = {
  id: number;
  name: string;
  SelectedImage: React.FC<SvgProps>;
  UnselectedImage: React.FC<SvgProps>;
};

type categoryData = {
  id: number;
  name: string;
  selectedImage: ImageSourcePropType;
  unselectedImage: ImageSourcePropType;
};

export const AssociationProvider = ({ children }: Props) => {
  const [association, setAssociation] = useState<number | null>(null);
  const [category, setCategory] = useState<number | null>(null);

  const associationData = [
    {
      id: 1,
      name: "APADRIT",
      SelectedImage: ApadritSelected,
      UnselectedImage: ApadritUnselected,
    },
    {
      id: 2,
      name: "APFOV",
      SelectedImage: ApfovSelected,
      UnselectedImage: ApfovUnselected,
    },
    {
      id: 3,
      name: "ASAGA",
      SelectedImage: AsagaSelected,
      UnselectedImage: AsagaUnselected,
    },
    {
      id: 4,
      name: "ASPACS",
      SelectedImage: AspacsSelected,
      UnselectedImage: AspacsUnselected,
    },
    {
      id: 5,
      name: "UATUMA",
      SelectedImage: UatumaSelected,
      UnselectedImage: UatumaUnselected,
    },
    {
      id: 6,
      name: "Guest",
      SelectedImage: GuestSelected,
      UnselectedImage: GuestSelected,
    },
  ];

  const categoryData = [
    {
      id: 1,
      name: "Coleta",
      selectedImage: require("../../assets/coletaSe.png"),
      unselectedImage: require("../../assets/coletaUn.png"),
    },
    {
      id: 2,
      name: "Usina",
      selectedImage: require("../../assets/usinaSe.png"),
      unselectedImage: require("../../assets/usinaUn.png"),
    },
    {
      id: 3,
      name: "Manejo",
      selectedImage: require("../../assets/manejoSe.png"),
      unselectedImage: require("../../assets/manejoUn.png"),
    },
    {
      id: 4,
      name: "Movelaria",
      selectedImage: require("../../assets/movelariaSe.png"),
      unselectedImage: require("../../assets/movelariaUn.png"),
    },
  ];

  return (
    <AssociationContext.Provider
      value={{
        associationData,
        categoryData,
        association,
        setAssociation,
        category,
        setCategory,
      }}
    >
      {children}
    </AssociationContext.Provider>
  );
};

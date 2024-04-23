import React, { ReactNode, createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { Alert } from "react-native";

interface IContext {
  user: User | null;
  login: (cpf: string, password: string) => void;
  signed: boolean;
  loading: boolean;
  signOut: () => void;
  checkLocalUser: () => void;
  signUp: (data: UserPost) => void;
}

export interface UserPost {
  UF: string | null;
  nome: string | null;
  cpf: string | null;
  RG: string | null;
  telefone: string | null;
  email: string | null;
  zona: string | null;
  endereco: string | null;
  municipio: string | null;
  cep: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  senha: string | null;
}

interface User {
  nome: string;
  id: string;
  createdAt: string;
  cpf: string;
}

interface Props {
  children: ReactNode;
}

export const AuthContext = createContext<IContext>({} as IContext);

export const AuthContextProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (cpf: string, password: string) => {
    setLoading(true);

    console.log(cpf);

    try {
      const data = {
        cpf: cpf,
        senha: password,
      };

      const response = await api.post("loginValidacao", data);

      console.log("data - >", response.data);

      const user = response.data;
      const localUser = JSON.stringify(response.data);
      await AsyncStorage.setItem("local-user", localUser);
      setUser(user);
      setLoading(false);
    } catch (error) {
      Alert.alert("Usuário não encontrado");
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    await AsyncStorage.removeItem("local-user");
    setUser(null);
    setLoading(false);
  };

  const signUp = async (data: UserPost) => {
    setLoading(true);
    console.log("user post -> ", data);
    try {
      await api.post("usuarios", data);
    } catch (error) {
      console.log("error ->", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const checkLocalUser = async () => {
    const localUser = await AsyncStorage.getItem("local-user");
    if (!localUser) {
      console.log("Nao tem usuario salvo");
      setUser(null);
      return;
    }
    console.log("localUser");

    const user = JSON.parse(localUser);
    setUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        login,
        loading,
        signOut,
        checkLocalUser,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

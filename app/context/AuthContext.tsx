import {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { Platform } from "react-native";

import apiClient from "@/utils/apiClient";
import ApiResponseStructure from "@/Structure/ApiResponseStructure";

type AuthData = {
  token: string | null;
  authenticated: boolean | null;
  userData: UserData | null;
};

type UserData = {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  picHash: string | null;
};

interface AuthProps {
  authState?: AuthData;
  onLogin: (email: string, password: string) => Promise<any>;
  onRegister: (
    email: string,
    password: string,
    name: string,
    surname: string
  ) => Promise<any>;
  onUpdateData: (name: string, surname: string) => Promise<any>;
  onLogout: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [authState, setAuthState] = useState<AuthData>({
    token: null,
    authenticated: false,
    userData: null,
  });
  const [restored,setAuthRestored] = useState(false);

  const BaseSetState = async (token: any, isRestore: boolean = false) => {
    if (!token) {
      delete apiClient.defaults.headers["authorization"];
      setAuthState({
        authenticated: false,
        token: token,
        userData: null,
      });
      Platform.OS == "web"
        ? await AsyncStorage.removeItem("token")
        : await SecureStore.deleteItemAsync("token");
    } else {
      apiClient.defaults.headers["authorization"] = token;
      setAuthState({
        authenticated: true,
        token: token,
        userData: jwtDecode(token),
      });
      if (!isRestore)
        Platform.OS == "web"
          ? await AsyncStorage.setItem("token", token)
          : SecureStore.setItem("token", token);
    }
  };

  const restoreToken = async () => {
    setAuthRestored(true);
    var Token : string | null = null;
    if (Platform.OS == "web") {
      Token = await AsyncStorage.getItem("token");
    } else {
      Token = await SecureStore.getItemAsync("token");
    }
    if(Token)
    {
      await BaseSetState(Token, false);
    }
  };

  useEffect(() => {
    if (!restored && authState.token == null) {
      restoreToken();
    }
  }, []);

  const login = async (email: string, password: string) => {
    var Response = await apiClient.post<ApiResponseStructure<string>>("/auth", {
      email,
      password,
    });
    if (Response?.data?.Content) {
      await BaseSetState(Response?.data?.Content);
      return true;
    }
    return false;
  };

  const updateData = async (name: string, surname: string) => {
    var Response = await apiClient.patch<ApiResponseStructure<any>>("/auth", {
      name,
      surname,
    });
    if (Response?.data?.Content) {
      await BaseSetState(Response?.data?.Content);
      return true;
    }
    return false;
  };

  const onRegister = async (
    email: string,
    password: string,
    name: string,
    surname: string
  ) => {
    return await apiClient.post<ApiResponseStructure<string>>(
      "/auth/register",
      {
        name,
        surname,
        email,
        password,
      }
    );
  };

  const logout = async () => {
    //Platform.OS == "web"
    try {
      BaseSetState(null);
    } catch (e) {
      // saving error
    }
  };

  const value: AuthProps = {
    authState: authState,
    onUpdateData: updateData,
    onRegister: onRegister,
    onLogin: login,
    onLogout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

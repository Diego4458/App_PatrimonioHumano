import axios from "axios";
import { Alert, Platform } from "react-native";

const defaultInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

defaultInstance.interceptors.response.use(
  function (response) {
    if (response.data) {
      let responseContent = response.data?.Message;
      if (responseContent?.Content) {
        Platform.OS == "web"
          ? alert(responseContent.Content)
          : Alert.alert(responseContent?.Title, responseContent.Content);
      }
    }
    return response;
  },
  function (error) {
    if (error?.response?.data) {
      let responseContent = error.response.data?.Message;
      if (responseContent?.Content) {
        Platform.OS == "web"
          ? alert(responseContent.Content)
          : Alert.alert(responseContent?.Title, responseContent.Content);
        return Promise.resolve();
      }
    } else {
      Platform.OS == "web"
        ? alert("Ocorreu uma falha ao carregar os dados requisitados")
        : Alert.alert("Ocorreu uma falha ao carregar os dados requisitados");
     return Promise.resolve();
    }
  }
);

export default defaultInstance;

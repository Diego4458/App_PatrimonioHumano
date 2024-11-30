import { Image, Text, View } from "react-native";
import Card from "./Dashboard/Card";
import ThemedButton from "./ThemedButton";
import { useAuth } from "@/app/context/AuthContext";
import { router } from "expo-router";

export default function NotFound() {

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          marginHorizontal: "auto",
          width: "70%",
          height: "70%",
          padding: 10,
          flexDirection: "column",
          justifyContent: "space-between",
          paddingVertical: 30,
          paddingHorizontal: 20,
          alignContent: "center",
        }}
      >
        <Image
          source={require("@/assets/images/notfound_emoji.png")}
          resizeMode="contain"
          style={{ width: "50%", height: "50%",flexShrink: 1 ,marginHorizontal: 'auto'}}
        />
        <Text style={{ marginHorizontal: "auto", marginTop: 10, fontSize: 20, textOverflow: "break-word" }}>
          O Recurso Requisitado não foi encontrado!, tente novamente mais tarde!
        </Text>
        <ThemedButton
          text="Voltar"
          onPress={() => {
            router.canGoBack() ? router.back() : router.navigate("/");
          }}
        />
      </Card>
    </View>
  );
}

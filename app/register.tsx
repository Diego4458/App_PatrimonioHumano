import InputField from "@/Components/InputField";
import ThemedButton from "@/Components/ThemedButton";
import React, { useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useAuth } from "./context/AuthContext";
import { router } from "expo-router";

export default function LoginScreen() {
  const { onRegister } = useAuth();
  const [disableButton, setdisableButton] = useState(false);

  const [UserData, setUserData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const [ErrorUserData, setErrorUserData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const OnSubmit = async () => {
    if (UserData.name.length <= 0) {
      setErrorUserData({
        ...ErrorUserData,
        name: "Precisa prencher o campo de nome!",
      });
      return;
    }
    if (UserData.surname.length <= 0) {
      setErrorUserData({
        ...ErrorUserData,
        surname: "Precisa prencher o campo de nome!",
      });
      return;
    }
    if (UserData.email.length <= 0) {
      setErrorUserData({
        ...ErrorUserData,
        email: "Precisa prencher o campo de nome!",
      });
      return;
    } else if (!UserData.email.includes("@")) {
      setErrorUserData({
        ...ErrorUserData,
        email: "Email Invalido!",
      });
      return;
    }
    if (UserData.password.length <= 0) {
      setErrorUserData({
        ...ErrorUserData,
        password: "Precisa prencher o campo de senha!",
      });
      return;
    }

    try {
      setdisableButton(true);
      if(await onRegister(
        UserData.email,
        UserData.password,
        UserData.name,
        UserData.surname
      ))
      {
        router.back();
      }
    } finally {
      setdisableButton(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/login.jpg")}
        style={styles.logo}
      />
      <Text style={styles.title}>Patrimônio Humano</Text>
      <Text style={styles.subtitle}>Cadastre-se</Text>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <InputField
            placeholder="Nome"
            value={UserData.name}
            onChangeText={(event) =>
              setUserData((prev) => ({ ...prev!, name: event }))
            }
            errorText={ErrorUserData.name}
          />
        </View>
        <View style={styles.gridItem}>
          <InputField
            placeholder="Sobrenome"
            value={UserData.surname}
            onChangeText={(event) =>
              setUserData((prev) => ({ ...prev!, surname:event }))
            }
            errorText={ErrorUserData.surname}
          />
        </View>
      </View>
      <InputField
        placeholder="Email"
        keyboardType="email-address"
        style={{marginBottom:5}}
        value={UserData.email}
        onChangeText={(event) =>
          setUserData((prev) => ({ ...prev!, email:event}))
        }
        errorText={ErrorUserData.email}
      />
      <InputField
        placeholder="Senha"
        secureTextEntry
        style={{marginBottom:5}}
        value={UserData.password}
        onChangeText={(event) =>
          setUserData((prev) => ({ ...prev!, password:event }))
        }
        errorText={ErrorUserData.password}
      />

      <ThemedButton
        text="Registar"
        disabled={disableButton}
        onPress={OnSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#005acd",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#0093cb",
    marginBottom: 30,
  },
  grid: {
    width: "100%",
    flexDirection: "row", // Alinha os itens lado a lado (colunas)
    flexWrap: "wrap", // Permite quebrar para a próxima linha
    justifyContent: "space-between", // Espaçamento uniforme entre os itens,
    gap: 5,
    marginBottom:5
  },
  gridItem: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

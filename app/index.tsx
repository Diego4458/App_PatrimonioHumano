import InputField from "@/Components/InputField";
import ThemedButton from "@/Components/ThemedButton";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useAuth } from "./context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const { authState, onLogin } = useAuth();
  const [disableButton, SetdisableButton] = useState(false);
  const login = async () => {
    try {
      SetdisableButton(true);
      if (!email.value.includes("@") || email.value.length <= 0) {
        setEmail({ ...email, error: "Email Invalido" });
        return;
      }
      if (password.value.length <= 0) {
        setPassword({ ...password, error: "Senha Invalido" });
        return;
      }
      await onLogin(email.value, password.value)
    } finally {
      SetdisableButton(false);
    }
  };

  useEffect(()=>{
    if(authState?.authenticated)
    {
       router.navigate('/dashboard/apointment')
    }
  },[authState?.authenticated])

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/login.jpg")}
        style={styles.logo}
      />
      <Text style={styles.title}>Patrimônio Humano</Text>
      <Text style={styles.subtitle}>Seja Bem Vindo!</Text>

      <InputField
        placeholder="Email"
        value={email.value}
        errorText={email.error}
        style={{marginBottom:5}}
        onChangeText={(event) => setEmail({ error: "", value: event })}
        keyboardType="email-address"
      />
      <InputField
        placeholder="Password"
        style={{marginBottom:5}}
        value={password.value}
        errorText={password.error}
        onChangeText={(event) => setPassword({ error: "", value: event })}
        secureTextEntry
      />

      <ThemedButton text="Entrar" style={{marginBottom:20}} disabled={disableButton} onPress={login} />

      {/* Links */}
      <Text style={styles.forgotPassword}>
        <Link href={"/forgot-password"}>Esqueceu a Senha?</Link>
      </Text>
      <Text style={styles.register}>
        Não tem uma conta?{" "}
        <Text style={styles.registerLink}>
          <Link href={"/register"}>Registrar!</Link>
        </Text>
      </Text>
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
  input: {
    width: "100%",
    height: 50,
    borderColor: "#005acd",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: "#F9F9F9",
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#005acd",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#f5ffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#0093cb",
    marginBottom: 15,
  },
  register: {
    fontSize: 14,
    color: "#0093cb",
  },
  registerLink: {
    color: "#005acd",
    fontWeight: "bold",
  },
});

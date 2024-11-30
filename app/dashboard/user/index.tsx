import { useAuth } from "@/app/context/AuthContext";
import ProfilePicComponent from "@/Components/Dashboard/ProfilePicComponent";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function ProfileScreen() {
  const { onLogout, authState } = useAuth();
  const [url, setUrl] = useState(
    `${process.env.EXPO_PUBLIC_API_URL}/user/default.jpg`
  );

  const sendtoSettings = () => {
    router.push("/dashboard/user/settings");
  };

  const Logout = () => {
    onLogout().then(() => {
      router.push("/");
    });
  };

  useEffect(() => {
    setUrl(
      `${process.env.EXPO_PUBLIC_API_URL}/user/${
        authState?.userData?.picHash ?? "default.jpg"
      }`
    );
  }, [authState]);

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <ProfilePicComponent url={authState?.userData?.picHash} />

        <Text style={styles.name}>
          {authState?.userData?.name} {authState?.userData?.surname}
        </Text>
        <Text style={styles.username}>{authState?.userData?.role}</Text>

        <View style={styles.grid}>
          <TouchableOpacity
            style={{ ...styles.gridItem, ...styles.editProfileButton }}
            onPress={sendtoSettings}
          >
            <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.gridItem,
              ...styles.editProfileButton,
              backgroundColor: "red",
            }}
            onPress={Logout}
          >
            <FontAwesome name="sign-out" color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Lista de Configurações 
      <ScrollView>
      
        <View style={styles.settingsList}>
          {Array.from({ length: 10 }).map((it, index) => (
            <View style={styles.settingsItem} key={index}>
              <View style={styles.NotificationIcon}>
                <FontAwesome name="warning" color={"#ffff00"} size={28} />
              </View>

              <Text style={styles.NotificationContent}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque tempus mollis ante, quis facilisis urna hendrerit
                vitae. Nulla at eros vitae magna rutrum consequat ac a tellus.
                Proin dignissim odio eu est placerat, non dictum ante blandit.
                Proin pharetra turpis et elit faucibus condimentum. Quisque vel
                elit eget dui facilisis tincidunt. Vivamus lacinia sapien in
                porttitor fermentum. Aenean sollicitudin erat eget lacus finibus
                volutpat. Nulla cursus porta neque non semper.
              </Text>
            </View>
          ))}
        </View>
        
      </ScrollView>
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  profileContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#007BFF",
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  username: {
    fontSize: 14,
    color: "#A0A0A0",
    marginBottom: 20,
  },
  editProfileButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  editProfileButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  settingsList: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  settingsItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  NotificationIcon: {
    backgroundColor: "#00000035",
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  NotificationContent: {},

  settingsText: {
    fontSize: 16,
    color: "#000",
  },
  logoutText: {
    color: "#FF4D4D",
    fontWeight: "bold",
  },
  grid: {
    width: "100%",
    flexDirection: "row", // Alinha os itens lado a lado (colunas)
    flexWrap: "wrap", // Permite quebrar para a próxima linha
    justifyContent: "space-between", // Espaçamento uniforme entre os itens,
    gap: 5,
  },
  gridItem: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

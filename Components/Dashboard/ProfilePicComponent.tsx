import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfilePicComponentProps {
  url?: string | null | undefined;
  children?: React.ReactNode;
}

export default function ProfilePicComponent({
  url,
  children,
}: ProfilePicComponentProps) {
  const [urlstr, setUrl] = useState(
    `${process.env.EXPO_PUBLIC_API_URL}/user/default.jpg`
  );

  useEffect(() => {
    setUrl(
      `${process.env.EXPO_PUBLIC_API_URL}/user/${url ?? "default.jpg"}`
    );
  }, [url]);

  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileImageContainer}>
        <Image source={{ uri: urlstr }} style={styles.profileImage} />
        {children}
      </View>
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
  settingsText: {
    fontSize: 16,
    color: "#000",
  },
  logoutText: {
    color: "#FF4D4D",
    fontWeight: "bold",
  },
  profileImageContainer: {
    position: "relative",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: "#007BFF",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#005acd",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#FFF",
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

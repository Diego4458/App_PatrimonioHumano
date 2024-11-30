import { useAuth } from "@/app/context/AuthContext";
import ProfilePicComponent from "@/Components/Dashboard/ProfilePicComponent";
import InputField from "@/Components/InputField";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfileScreen() {
  const [disableButton, setdisableButton] = useState(false);
  const { authState, onUpdateData } = useAuth();
  const [UserData, setUserData] = useState({
    name: authState?.userData?.name,
    surname: authState?.userData?.surname,
    email: authState?.userData?.email,
  });

  const [ErrorUserData, setErrorUserData] = useState({
    name: "",
    surname: "",
  });

  const SendRequest = async () => {
    try {
      setdisableButton(true);
      if (ErrorUserData.name != "" || ErrorUserData.surname != "") {
        alert("Resolva todos os erros antes de mandar a atualização");
        return;
      }
      if (await onUpdateData(UserData.name, UserData.surname)) {
        router.back();
      }
    } finally {
      setdisableButton(false);
    }
  };

  const ChangeName = (e: any) => {
    setUserData({
      name: e,
      email: UserData.email,
      surname: UserData.surname,
    });
    if (e <= 0) {
      setErrorUserData({
        surname: ErrorUserData.surname,
        name: "O Campo Nome não pode estar vazio",
      });
    } else {
      setErrorUserData({ surname: ErrorUserData.surname, name: "" });
    }
  };

  const ChangeSurname = (e: any) => {
    setUserData({
      name: UserData.name,
      email: UserData.email,
      surname: e,
    });
    if (e <= 0) {
      setErrorUserData({
        name: ErrorUserData.name,
        surname: "O Campo sobrenome não pode estar vazio",
      });
    } else {
      setErrorUserData({ name: ErrorUserData.name, surname: "" });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ProfilePicComponent url={authState?.userData?.picHash}>
        <TouchableOpacity style={styles.cameraIcon}>
          <Text style={{ color: "#FFF" }}>📷</Text>
        </TouchableOpacity>
      </ProfilePicComponent>

      {/* Inputs */}
      <View style={styles.form}>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <InputField
              placeholder="Nome"
              value={UserData.name}
              errorText={ErrorUserData.name}
              onChangeText={ChangeName}
            />
          </View>
          <View style={styles.gridItem}>
            <InputField
              placeholder="Sobrenome"
              value={UserData.surname}
              errorText={ErrorUserData.surname}
              onChangeText={ChangeSurname}
            />
          </View>
        </View>
        <InputField
          placeholder="email"
          style={{
            marginTop: 10,
          }}
          keyboardType="email-address"
          aria-disabled={true}
          value={UserData.email}
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={SendRequest}
        disabled={disableButton}
      >
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
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

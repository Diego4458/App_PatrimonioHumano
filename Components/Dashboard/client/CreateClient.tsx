import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Card from "../Card";
import { useState } from "react";
import ThemedButton from "@/Components/ThemedButton";

import apiClient from "@/utils/apiClient";
import ApiResponseStructure from "@/Structure/ApiResponseStructure";
import AlertComponent, { AlertType } from "@/Components/AlertComponent";
import InputField from "@/Components/InputField";
import ApointmentInterviewedStructure from "@/Structure/ApointmentInterviewedStructure";

interface CompanyItemProp {
  closeAction: any;
}

export default function CreateClient({ closeAction }: CompanyItemProp) {
  var [name, setName] = useState("");
  var [document, setdocument] = useState("");
  var [errorName, seterrorName] = useState("");
  var [errordocument, seterrordocument] = useState("");

  const UpdateContactInfo = async () => {
    if (errorName != "" || errorName != "") return;

    var Result = await apiClient.post<
      ApiResponseStructure<ApointmentInterviewedStructure>
    >(`/client`, {
      name,
      document,
    });
    if (Result?.data?.Content) {
      closeAction();
    }
  };

  const onChangeDocument = (text: string) => {
    if (text.length <= 0) {
      seterrordocument("É nescessário preencher o campo de documento");
    } else if (text.length < 13) {
      seterrordocument("É nescessário ter no minimo 13 caracteres");
    } else if (errordocument != "") {
      seterrordocument("");
    }
    setdocument(text);
  };

  const onChangeName = (text: string) => {
    if (text.length <= 0) {
      seterrorName("É nescessário preencher o campo de nome");
    } else if (text.length < 2) {
      seterrorName("É nescessário ter no minimo 2 caracteres");
    } else if (errorName != "") {
      seterrorName("");
    }
    setName(text);
  };

  return (
    <View style={styles.modalContainer}>
      <Card style={styles.Card}>
        <View>
          <AlertComponent
            Content="Ao criar um usuario não é possivel deletar!"
            Type={AlertType.Warning}
          />
          <Text style={{ fontSize: 18, marginHorizontal: "auto" }}>
            Criando novo entrevistado
          </Text>
        </View>
        <View style={{ justifyContent: "space-evenly", gap: 5 }}>
          <InputField
            placeholder="Nome do Entrevistado"
            errorText={errorName}
            value={name}
            onChangeText={(text) => onChangeName(text)}
          />
          <InputField
            placeholder="Documento do Entrevistado"
            errorText={errordocument}
            value={document}
            onChangeText={(text) => onChangeDocument(text)}
          />
          <ThemedButton text="Criar" onPress={UpdateContactInfo} />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  Card: {
    width: "70%",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
    gap: 20,
  },
});

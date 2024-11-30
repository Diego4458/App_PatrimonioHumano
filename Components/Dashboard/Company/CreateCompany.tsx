import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Card from "../Card";
import { useState } from "react";
import ThemedButton from "@/Components/ThemedButton";

import apiClient from "@/utils/apiClient";
import ApiResponseStructure from "@/Structure/ApiResponseStructure";
import ApointmentStructure from "@/Structure/ApointmentStructure";
import { router } from "expo-router";
import AlertComponent, { AlertType } from "@/Components/AlertComponent";
import InputField from "@/Components/InputField";

interface CompanyItemProp {
  closeAction: any;
}

export default function CreateCompany({ closeAction }: CompanyItemProp) {
  var [info, setInformation] = useState("");
  var [error, seterror] = useState("");

  const UpdateContactInfo = async () => {
    if(!info || info.length < 2)
    {
      seterror("O Tamanho Minímo é 2 caracteres")
      return;
    }

    var Result = await apiClient.post<
      ApiResponseStructure<ApointmentStructure>
    >(`/company`, {
      name: info,
      contact:[]
    });
    if (Result?.data?.Content) {
      router.navigate({
        pathname: "/dashboard/company/[id]",
        params: {
          id: Result.data.Content.id,
        },
      });
      closeAction();
    }
  };

  return (
    <View style={styles.modalContainer}>
      <Card style={styles.Card}>
        <AlertComponent
          Content="Ao Criar uma empresa você será redirecionado para a página da mesma, e uma vez criado não é possivel deletar!"
          Type={AlertType.Warning}
        />
        <Text>Criando Nova Empresa</Text>
        <InputField
          placeholder="Nome da Empresa"
          errorText={error}
          value={info}
          onChangeText={(text) => setInformation(text)}
        />
        <ThemedButton text="Criar" onPress={UpdateContactInfo} />
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
    alignContent: "space-between",
    padding: 10,
    gap: 50,
  },
});

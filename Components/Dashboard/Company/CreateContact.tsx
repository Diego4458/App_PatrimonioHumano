import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Card from "../Card";
import { useEffect, useState } from "react";
import ContactStructure from "@/Structure/ContactStructure";
import InputField from "@/Components/InputField";
import ThemedButton from "@/Components/ThemedButton";

import apiClient from "@/utils/apiClient";
import ApiResponseStructure from "@/Structure/ApiResponseStructure";

interface CompanyItemProp {
  item?: ContactStructure;
  requestUpdate?: any;
}

function validPhone(phone: string) {
  return /^\(?([1-9][0-9])\)?[\s-]?9?[0-9]{4}[-\s]?[0-9]{4}$/.test(phone);
}

export default function CreateContact({
  item,
  requestUpdate,
}: CompanyItemProp) {
  var [info, setInformation] = useState<ContactStructure>();
  var [error, setError] = useState({
    responsibleName: "",
    email: "",
    phoneNumber: "",
    Address: "",
  });

  useEffect(() => {
    setInformation(item);
  }, [item]);

  if (!info) {
    return <ActivityIndicator />;
  }

  const UpdateName = (text: string) => {
    if (!text) {
      setError((prev) => ({
        ...prev!,
        responsibleName: "O Campo de Nome Deve Ser Preenchido!",
      }));
    } else {
      setError((prev) => ({ ...prev!, responsibleName: "" }));
    }
    setInformation((prev) => ({ ...prev!, responsibleName: text }));
  };

  const UpdateEmail = (text: string) => {
    if (!text) {
      setError((prev) => ({
        ...prev!,
        email: "O campo de email deve ser preenchido!",
      }));
    } else if (!text.includes("@") || !text.includes(".")) {
      setError((prev) => ({
        ...prev!,
        email: "O campo de email deve ser valido!",
      }));
    } else {
      setError((prev) => ({ ...prev!, email: "" }));
    }
    setInformation((prev) => ({ ...prev!, email: text }));
  };

  const UpdatePhone = (text: string) => {
    if (!text || validPhone(text)) {
      setError((prev) => ({ ...prev!, phoneNumber: "" }));
    } else {
      setError((prev) => ({
        ...prev!,
        phoneNumber: "O telefone deve ser válido ou vazio",
      }));
    }
    setInformation((prev) => ({ ...prev!, phoneNumber: text }));
  };

  const UpdateContactInfo = async () => {
    var Result = await apiClient.post<ApiResponseStructure<ContactStructure>>(
      `/company/${item!.CompanyId}/contact`,info
    );
    if (Result?.data?.Content) {
      requestUpdate();
    }
  };
  return (
    <View style={styles.modalContainer}>
      <Card style={styles.Card}>
        <Text>Criando Contato</Text>
        <View style={styles.inputModal}>
          <InputField
            value={info?.responsibleName}
            errorText={error.responsibleName}
            placeholder="Nome"
            onChangeText={UpdateName}
          />
          <InputField
            value={info?.email}
            errorText={error?.email}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={UpdateEmail}
          />
          <InputField
            value={info?.phoneNumber}
            errorText={error?.phoneNumber}
            placeholder="Numero de Telefone"
            keyboardType="number-pad"
            onChangeText={UpdatePhone}
          />
          <InputField
            value={info?.Address}
            placeholder="Endereço"
            onChangeText={(text) => {
              setInformation((prev) => ({ ...prev!, Address: text }));
            }}
          />
        </View>
        <ThemedButton text="Enviar" onPress={UpdateContactInfo} />
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
  inputModal: {
    flexDirection: "column",
    gap: 5,
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

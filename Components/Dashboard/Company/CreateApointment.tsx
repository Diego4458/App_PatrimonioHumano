import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Card from "../Card";
import { useState } from "react";
import ThemedButton from "@/Components/ThemedButton";

import apiClient from "@/utils/apiClient";
import ApiResponseStructure from "@/Structure/ApiResponseStructure";
import DateTimePicker from "react-native-ui-datepicker";
import ApointmentStructure from "@/Structure/ApointmentStructure";
import { router } from "expo-router";
import AlertComponent, { AlertType } from "@/Components/AlertComponent";

interface CompanyItemProp {
  id: string;
  closeAction: any;
}

export default function CreateApointment({ id, closeAction }: CompanyItemProp) {
  var [info, setInformation] = useState(new Date());

  const UpdateContactInfo = async () => {
    var Result = await apiClient.post<
      ApiResponseStructure<ApointmentStructure>
    >(`/company/${id}/apointments`, {
      AppointmentDate: info,
    });
    if (Result?.data?.Content) {
      router.navigate({
        pathname: "/dashboard/apointment/[id]",
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
        Content="Ao Criar um agendamento você será redirecionado para a página da mesma,e uma vez criado não é possivel deletar!"
        Type={AlertType.Warning}
      />
        <Text>Criando Nova Consulta</Text>
        <DateTimePicker
          mode="single"
          timePicker
          minDate={Date()}
          date={info}
          onChange={(tdate: any) => {
            setInformation(new Date(tdate.date));
          }}
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

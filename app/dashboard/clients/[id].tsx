import NotFound from "@/Components/NotFoundComponent";
import ApiResponseStructure from "@/Structure/ApiResponseStructure";
import ApointmentInterviewedStructure from "@/Structure/ApointmentInterviewedStructure";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import apiClient from "@/utils/apiClient";
import Card from "@/Components/Dashboard/Card";
import InputField from "@/Components/InputField";
import ThemedButton from "@/Components/ThemedButton";
import ApointmentStructure from "@/Structure/ApointmentStructure";
import ApointmentItem from "@/Components/Dashboard/Apointment/ApointmentItem";

export default function SingleClientPage() {
  const { id } = useLocalSearchParams();
  const [isUpdating, setIsUpdating] = useState(false);

  const [Error, setError] = useState({
    name: "",
    document: "",
  });

  const [ClientsData, setClientsData] = useState<
    ApointmentInterviewedStructure | null | undefined
  >(null);

  const [ClientAppointmentData, setClientAppointmentData] = useState<
    ApointmentStructure[]
  >([]);

  const [isLoading, setisLoading] = useState(false);

  const AsyncLoadPage = async () => {
    if (isLoading) return;
    setisLoading(true);
    try {
      var Result = await apiClient.get<
        ApiResponseStructure<ApointmentInterviewedStructure>
      >(`/client/${id}`);

      if (Result?.data?.Content) {
        setClientsData(Result.data.Content);

        var Resulttwo = await apiClient.get<
          ApiResponseStructure<ApointmentStructure[]>
        >(`/client/${id}/apointments`);

        if (Resulttwo) {
          setClientAppointmentData(Resulttwo.data.Content);
        }
      }
    } finally {
      setisLoading(false);
    }
  };

  const AsyncUpdate = async () => {
    var ErrorClone = Error;
    ErrorClone.name =
      ClientsData!.name.length < 2
        ? "O Nome Tem que ter no minimo 2 caracteres"
        : "";
    ErrorClone.document =
      ClientsData!.name.length < 13
        ? "O Documento tem que ter no minimo 13 caracteres"
        : "";

    if (ErrorClone.name != "" || ErrorClone.document != "") {
      setError(ErrorClone);
      return;
    }

    var Result = await apiClient.patch<
      ApiResponseStructure<ApointmentInterviewedStructure>
    >(`/client/${id}`, ClientsData);

    if (Result?.data?.Content) {
      setClientsData(Result.data.Content);
    }
  };

  useEffect(() => {
    AsyncLoadPage();
  }, [id]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!ClientsData) {
    return <NotFound />;
  }

  return (
    <View style={{ margin: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "Bold", marginVertical: 5 }}>
        Dados:
      </Text>
      <Card style={{ flexDirection: "column", gap: 5 }}>
      {isUpdating && (<ActivityIndicator />)}
        <InputField placeholder="Nome" value={ClientsData.name} onChangeText={(text) =>{
          setClientsData((prev) => ({ ...prev!, name: text }));
        }} />
        <InputField placeholder="Documento" value={ClientsData.document} onChangeText={(text) =>{
          setClientsData((prev) => ({ ...prev!, document: text }));
        }} />
        <ThemedButton text="Atualizar Dados" onPress={AsyncUpdate} disabled={isUpdating} />
      </Card>
      <Text style={{ fontSize: 18, fontWeight: "Bold", marginVertical: 5 }}>
        Consultas:
      </Text>
      <FlatList
        data={ClientAppointmentData}
        renderItem={({ item }) => <ApointmentItem item={item} key={item.id} />}
      />
    </View>
  );
}

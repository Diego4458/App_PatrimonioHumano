import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import apiClient from "@/utils/apiClient";
import ApointmentStructure from "@/Structure/ApointmentStructure";
import ApiResponseStructure from "@/Structure/ApiResponseStructure";
import CompanyItem from "@/Components/Dashboard/Company/CompanyItem";
import Card from "@/Components/Dashboard/Card";
import ThemedButton from "@/Components/ThemedButton";
import DateTimePicker from "react-native-ui-datepicker";
import { SingleChange } from "react-native-ui-datepicker/lib/typescript/src/types";

import { Table, TableWrapper, Row, Cell } from "react-native-reanimated-table";
import { Dropdown } from "react-native-element-dropdown";
import ApointmentPresenceStructure from "@/Structure/ApointmentPresenceStructure";
import SearchClientsModal from "@/Components/Dashboard/Apointment/SearchClientsModal";
import AlertComponent, { AlertType } from "@/Components/AlertComponent";

export default function Apointment() {
  const [isLoading, setIsLoading] = useState(false);
  const [dateinfo, setdateinfo] = useState(new Date());
  const [data, setData] = useState<ApointmentStructure | null>(null);
  const { id } = useLocalSearchParams();
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSeachUserModalVisible, setSeachUserModalVisible] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<{
    id: string;
    field: string;
    value: string;
  } | null>(null);

  const AsyncLoadPage = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      var Result = await apiClient.get<
        ApiResponseStructure<ApointmentStructure>
      >(`/apointment/${id}`);

      if (Result?.data?.Content) {
        setdateinfo(new Date(Result.data.Content.apointmentDate));

        Result.data.Content.apointmentDate = new Date(
          Result.data.Content.apointmentDate
        );

        setData(Result.data.Content);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const SendDateUpdatePage = async () => {
    setIsLoading(true);
    try {
      var Result = await apiClient.put<ApiResponseStructure<string>>(
        `/apointment/${id}`,
        {
          data: {
            AppointmentDate: dateinfo,
          },
        }
      );

      if (Result?.data?.Content) {
        setdateinfo(new Date(Result.data.Content));
        setIsDateModalVisible(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setDate = (tdate: SingleChange) => {
    setdateinfo(new Date(tdate.date));
  };

  useEffect(() => {
    AsyncLoadPage();
  }, [id]);

  const handleEdit = (id: string, field: string, value: string) => {
    setCurrentEdit({ id, field, value });
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    for (let index = 0; index < data!.presences!.length; index++) {
      if (data!.presences && data!.presences[index].id === currentEdit?.id) {
        let obj: any = {};
        obj[currentEdit.field] = currentEdit.value;
        var PresenceInfo = data!.presences[index];
        const result = await apiClient.put<
          ApiResponseStructure<ApointmentPresenceStructure>
        >(`apointment/${PresenceInfo.apointmentId}/${PresenceInfo.Client.id}`, {
          data: obj,
        });

        if (result?.data?.Content) {
          setData((prev) => {
            const newPresences = [...(prev?.presences || [])];
            newPresences[index] = result.data.Content;
            return {
              ...prev!,
              presences: newPresences,
            };
          });
        }

        break;
      }
    }
    setIsModalVisible(false);
    setCurrentEdit(null);
  };

  const RedirectToPage = (value: any) => {
    router.push({
      pathname: "/dashboard/apointment/[id]/[client]",
      params: {
        client: value.Client.id,
        id: data.id,
      },
    });
  };

  if (isLoading || data == null) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView style={{ margin: 10 }}>
      <Text style={styles.title}>Empresa:</Text>

      <CompanyItem item={data!.company} />

      <Text style={styles.title}>Data do Agendamento:</Text>
      <Card
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          flexWrap: "wrap",
        }}
      >
        <Text style={{ marginVertical: "auto" }}>
          Tempo: {dateinfo.toLocaleString("pt-BR")}
        </Text>
        <TouchableOpacity onPress={() => setIsDateModalVisible(true)}>
          <Text
            style={{
              borderRadius: 15,
              padding: 5,
              borderStyle: "none",
            }}
          >
            📅
          </Text>
        </TouchableOpacity>
      </Card>

      <Text style={styles.title}>Lista De Presença:</Text>

      <Card style={{ flexDirection: "column" }}>
        <AlertComponent
          Content="É Possivel editar os dados clicando no campo em roxo!"
          Type={AlertType.Info}
          Clossable
        />
        <View style={styles.container}>
          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Row
              data={["Nome", "Documento", "Presença", "Resultado", "Arquivos"]}
              style={styles.head}
              textStyle={styles.text}
            />
            {data?.presences && data.presences.length > 0 ? (
              data.presences.map((value) => (
                <TableWrapper key={value.id} style={styles.row}>
                  <Cell data={value.Client.name} textStyle={styles.text} />
                  <Cell data={value.Client.document} textStyle={styles.text} />
                  <Cell
                    data={
                      <TouchableOpacity
                        onPress={() =>
                          handleEdit(value.id, "wasPresent", value.wasPresent)
                        }
                      >
                        <Text style={styles.textChangeble}>
                          {value.wasPresent}
                        </Text>
                      </TouchableOpacity>
                    }
                    textStyle={styles.textChangeble}
                  />
                  <Cell
                    data={
                      <TouchableOpacity
                        onPress={() =>
                          handleEdit(value.id, "testResult", value.testResult)
                        }
                      >
                        <Text style={styles.textChangeble}>
                          {value.testResult}
                        </Text>
                      </TouchableOpacity>
                    }
                    textStyle={styles.textChangeble}
                  />
                  <Cell
                    data={
                      <TouchableOpacity onPress={() => RedirectToPage(value)}>
                        <Text style={styles.textChangeble}>Arquivos</Text>
                      </TouchableOpacity>
                    }
                    textStyle={styles.textChangeble}
                  />
                </TableWrapper>
              ))
            ) : (
              <TableWrapper style={styles.row}>
                <Cell
                  data={
                    "Parece que ainda não foi adicionado nenhum participante!"
                  }
                  textStyle={styles.text}
                />
              </TableWrapper>
            )}
          </Table>
        </View>
        <ThemedButton
          style={{ marginTop: 10 }}
          text="Adicionar Participante"
          onPress={() => {
            setSeachUserModalVisible(true);
          }}
        />
      </Card>

      {isModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Card style={{ flexDirection: "column", width: "80%", marginHorizontal: 'auto' }}>
              <Dropdown
                data={
                  currentEdit?.field == "testResult"
                    ? [
                        { value: "Não Avaliado" },
                        { value: "apto" },
                        { value: "apto restrito" },
                        { value: "inapto" },
                      ]
                    : [
                        { value: "Não Informado" },
                        { value: "faltou" },
                        { value: "compareceu" },
                        { value: "remarcou" },
                      ]
                }
                style={styles.dropdown}
                labelField="value"
                valueField="value"
                value={currentEdit?.value}
                onChange={(value) => {
                  setCurrentEdit((prev) => ({ ...prev, value: value.value }));
                }}
              />
              <ThemedButton text="Salvar" onPress={handleSave} />
            </Card>
          </View>
        </Modal>
      )}

      {isDateModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isDateModalVisible}
          onRequestClose={() => setIsDateModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Card style={{ flexDirection: "column", width: "80%", marginHorizontal: 'auto' }}>
              <DateTimePicker
                mode="single"
                timePicker
                minDate={Date()}
                date={dateinfo}
                onChange={setDate}
              />
              <ThemedButton text="Salvar" onPress={SendDateUpdatePage} />
            </Card>
          </View>
        </Modal>
      )}

      {isSeachUserModalVisible && (
        <SearchClientsModal
          id={id}
          onRequestClose={() => {
            setSeachUserModalVisible(false);
          }}
          onRequestUpdate={AsyncLoadPage}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginBottom: 5,
  },
  row: { flexDirection: "row" },
  container: { flex: 1, padding: 5, paddingTop: 10, backgroundColor: "#fff" },
  head: { minHeight: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  textChangeble: { margin: 6, color: "purple" },
  modalContainer: {
    flex: 1,
    height:'100%',
    justifyContent: "center",
    alignContent: 'center',
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownButton: {
    width: "80%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  dropdownButtonText: {
    textAlign: "center",
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    minWidth: 100,
    borderColor: "#005acd",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: "#F9F9F9",
    fontSize: 16,
    marginVertical: 5,
  },
});

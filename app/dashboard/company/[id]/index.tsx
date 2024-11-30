import ThemedButton from "@/Components/ThemedButton";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-reanimated-table";

import apiservice from "@/utils/apiClient";
import ApiResponseStructure from "@/Structure/ApiResponseStructure";
import CompanyStructure from "@/Structure/CompanyStructure";
import CompanyItem from "@/Components/Dashboard/Company/CompanyItem";
import NotFound from "@/Components/NotFoundComponent";
import Card from "@/Components/Dashboard/Card";
import AlertComponent, { AlertType } from "@/Components/AlertComponent";
import ChangeContact from "@/Components/Dashboard/Company/ChangeContact";
import ContactStructure from "@/Structure/ContactStructure";
import PaginationMetaStructure from "@/Structure/PaginationMetaStructure";
import ApointmentStructure from "@/Structure/ApointmentStructure";
import apiClient from "@/utils/apiClient";
import PaginationResponseStructure from "@/Structure/PaginationResponseStructure";
import ApointmentItem from "@/Components/Dashboard/Apointment/ApointmentItem";
import CreateContact from "@/Components/Dashboard/Company/CreateContact";
import CreateApointment from "@/Components/Dashboard/Company/CreateApointment";

export default function CompanyInfoPage() {
  const [isloading, setIsloading] = useState(false);
  const { id } = useLocalSearchParams();
  const [company, setCompany] = useState<CompanyStructure | null | undefined>();
  const [currentContact, setContact] = useState<
    ContactStructure | null | undefined
  >();
  const [isModalCVisible, setisModalCVisible] = useState(false);
  const [isModalApointVisible, setisModalApointVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApointLoading, setIsApointLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [paginationData, setPaginationData] =
    useState<PaginationMetaStructure>();

  const [apointmentsData, setApointmentsData] = useState<ApointmentStructure[]>(
    []
  );

  const AsyncLoadPage = async (_page: number) => {
    if (
      isApointLoading ||
      page >= _page ||
      (paginationData &&
        paginationData.maxPage > 0 &&
        _page > paginationData.maxPage)
    )
      return;
    setIsApointLoading(true);
    try {
      var Result = await apiClient.get<
        PaginationResponseStructure<ApointmentStructure>
      >(`/company/${id}/apointments`, {
        params: {
          page: _page,
        },
      });

      if (Result?.data?.Content) {
        setApointmentsData((pref) => {
          return [...pref, ...Result.data.Content.Data];
        });
        setPaginationData(Result.data.Content.Meta);
        setPage(_page);
      }
    } finally {
      setIsApointLoading(false);
    }
  };

  const LoadPage = async () => {
    if (isloading || company?.id == id) return;
    setIsloading(true);
    setIsModalVisible(false);
    setisModalCVisible(false);

    try {
      var Response = await apiservice.get<
        ApiResponseStructure<CompanyStructure>
      >(`/company/${id}`);
      if (Response?.data?.Content) {
        setCompany(Response?.data?.Content);
      }
    } finally {
      setIsloading(false);
    }

    return;
  };

  const reloadLoadPage = async () => {
    setCompany(null);
  };

  useEffect(() => {
    LoadPage();
  }, [id, company]);

  useEffect(() => {
    AsyncLoadPage(1);
  }, [page]);

  if (isloading) {
    return <ActivityIndicator />;
  }

  if (!company) {
    return <NotFound />;
  }

  return (
    <View style={{ margin: 10 }}>
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <ChangeContact item={currentContact} requestUpdate={reloadLoadPage} />
      </Modal>
      {isModalCVisible && (
        <Modal
          visible={true}
          transparent={true}
          onRequestClose={() => {
            setisModalCVisible(false);
          }}
        >
          <CreateContact
            item={currentContact!}
            requestUpdate={reloadLoadPage}
          />
        </Modal>
      )}
      {isModalApointVisible && (
        <Modal
          visible={true}
          transparent={true}
          onRequestClose={() => {
            setisModalApointVisible(false);
          }}
        >
          <CreateApointment
            id={id}
            closeAction={() => {
              setisModalApointVisible(false);
            }}
          />
        </Modal>
      )}
      <CompanyItem item={company!} />

      <Text>Contatos:</Text>
      <Card style={{ flexDirection: "column", gap: 5 }}>
        <AlertComponent
          Content="É Possivel editar os dados clicando no nome do Representante!"
          Type={AlertType.Info}
          Clossable
        />

        <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
          <Row
            data={["Nome", "Email", "Telefone", "Endereço"]}
            style={styles.head}
            textStyle={styles.text}
          />
          {company.Contacts && company.Contacts.length > 0 ? (
            company.Contacts.map((value) => (
              <TableWrapper key={value.id} style={styles.row}>
                <Cell
                  data={
                    <TouchableOpacity
                      onPress={() => {
                        setContact(value);
                        setIsModalVisible(true);
                      }}
                    >
                      <Text style={styles.textChangeble}>
                        {value.responsibleName}
                      </Text>
                    </TouchableOpacity>
                  }
                  textStyle={styles.textChangeble}
                />
                <Cell
                  data={value.email ?? "Não Cadastrado"}
                  textStyle={styles.text}
                />
                <Cell
                  data={value.phoneNumber ?? "Não Cadastrado"}
                  textStyle={styles.text}
                />
                <Cell
                  data={value.Address ?? "Não Cadastrado"}
                  textStyle={styles.text}
                />
              </TableWrapper>
            ))
          ) : (
            <TableWrapper style={styles.row}>
              <Cell
                data={"Parece que ainda não foi adicionado nenhum contato!"}
                textStyle={styles.text}
              />
            </TableWrapper>
          )}
        </Table>
        <ThemedButton
          text="Adicionar Novo Contato"
          onPress={() => {
            setContact({
              CompanyId: id,
              email: "",
              Address: "",
              id: "",
              phoneNumber: "",
              responsibleName: "",
            });
            setisModalCVisible(true);
          }}
        />
      </Card>

      <Text>Agendamentos:</Text>
      <Card style={{ flexDirection: "column"}}>
        <ThemedButton
          text="Agendar Nova Consulta"
          onPress={() => {
            setisModalApointVisible(true);
          }}
        />
        {paginationData ? (
          <FlatList
            data={apointmentsData}
            renderItem={({ item }) => (
              <ApointmentItem item={item} key={item.id} />
            )}
            showsVerticalScrollIndicator={false}
            onEndReached={async () => {
              await AsyncLoadPage(paginationData.page + 1);
            }}
            ListFooterComponent={() => isApointLoading && <ActivityIndicator />}
          />
        ) : (
          <ActivityIndicator size={"large"} />
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row" },
  container: { flex: 1, padding: 5, paddingTop: 5, backgroundColor: "#fff" },
  head: { minHeight: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  textChangeble: { margin: 6, color: "purple" },
});

import PageComponent from "@/Components/Dashboard/PageComponent";
import ThemedButton from "@/Components/ThemedButton";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Modal, View } from "react-native";
import apiClient from "@/utils/apiClient";
import PaginationResponseStructure from "@/Structure/PaginationResponseStructure";
import PaginationMetaStructure from "@/Structure/PaginationMetaStructure";
import { useAuth } from "../../context/AuthContext";
import ApointmentInterviewedStructure from "@/Structure/ApointmentInterviewedStructure";
import ClientItem from "@/Components/Dashboard/client/ClientItem";
import CreateClient from "@/Components/Dashboard/client/CreateClient";
import InputField from "@/Components/InputField";
import debouce from "lodash.debounce";

export default function CompanyScreen() {
  const [message, setMessage] = useState("");
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [ClientsModal, setClientsModal] = useState(false);
  const [paginationData, setPaginationData] = useState<PaginationMetaStructure>(
    {
      page: 1,
      size: 10,
      count: 0,
      maxPage: 0,
      search: null,
    }
  );
  const [ClientsData, setClientsData] = useState<
    ApointmentInterviewedStructure[]
  >([]);

  const AsyncLoadPage = async (page: number) => {
    if (
      isLoading ||
      (paginationData.maxPage > 0 && page > paginationData.maxPage)
    )
      return;
    setIsLoading(true);
    try {
      var Result = await apiClient.get<
        PaginationResponseStructure<ApointmentInterviewedStructure>
      >("/client", {
        params: {
          size: paginationData.size,
          count: paginationData.count,
          page,
          search: message,
        },
      });

      if (Result?.data?.Content) {
        setClientsData((pref) => {
          return [...pref, ...Result.data.Content.Data];
        });
        setPaginationData(Result.data.Content.Meta);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedResults = debouce(async (text: string) => {
    setMessage(text);
    setClientsData([]);
    AsyncLoadPage(1);
  }, 700);

  useEffect(() => {
    if (authState?.authenticated && paginationData.count == 0) AsyncLoadPage(1);
  }, [authState]);


  return (
    <PageComponent
      text={
        <InputField
          placeholder="Nome De Pesquisa"
          containerStyle={{}}
          onChangeText={debouncedResults}
        />
      }
      ExtraButton={
        <ThemedButton text="Adicionar" onPress={() => setClientsModal(true)} />
      }
    >
      {ClientsModal && (
        <Modal
          visible={true}
          transparent={true}
          onRequestClose={() => setClientsModal(false)}
        >
          <CreateClient
            closeAction={async () => {
              setClientsData([]);
              setPaginationData({
                page: 1,
                size: 10,
                count: 0,
                maxPage: 0,
                search: null,
              });
              setClientsModal(false);
              await AsyncLoadPage(1);
            }}
          />
        </Modal>
      )}

      <FlatList
        data={ClientsData}
        renderItem={({ item }) => (
          <ClientItem item={item} key={item.id} redirect />
        )}
        showsVerticalScrollIndicator={false}
        onEndReached={async () => {
          await AsyncLoadPage(paginationData.page + 1);
        }}
        ListFooterComponent={() => isLoading && <ActivityIndicator />}
      />
    </PageComponent>
  );
}

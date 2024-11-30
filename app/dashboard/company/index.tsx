import CompanyItem from "@/Components/Dashboard/Company/CompanyItem";
import PageComponent from "@/Components/Dashboard/PageComponent";
import ThemedButton from "@/Components/ThemedButton";
import CompanyStructure from "@/Structure/CompanyStructure";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Modal, View } from "react-native";
import apiClient from "@/utils/apiClient";
import PaginationResponseStructure from "@/Structure/PaginationResponseStructure";
import PaginationMetaStructure from "@/Structure/PaginationMetaStructure";
import { useAuth } from "../../context/AuthContext";
import { router } from "expo-router";
import CreateCompany from "@/Components/Dashboard/Company/CreateCompany";

export default function CompanyScreen() {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [companyModal, setCompanyModal] = useState(false);
  const [paginationData, setPaginationData] = useState<PaginationMetaStructure>(
    {
      page: 1,
      size: 10,
      count: 0,
      maxPage: 0,
      search: null,
    }
  );
  const [companyData, setCompanyData] = useState<CompanyStructure[]>([]);

  const AsyncLoadPage = async (page: number) => {
    if (
      isLoading ||
      (paginationData.maxPage > 0 && page > paginationData.maxPage)
    )
      return;
    setIsLoading(true);
    try {
      var Result = await apiClient.get<
        PaginationResponseStructure<CompanyStructure>
      >("/company", {
        params: {
          ...paginationData,
          page,
        },
      });

      if (Result?.data?.Content) {
        setCompanyData((pref) => {
          return [...pref, ...Result.data.Content.Data];
        });
        setPaginationData(Result.data.Content.Meta);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authState?.authenticated && paginationData.count == 0) AsyncLoadPage(1);
  }, [authState]);

  return (
    <PageComponent
      text="Empresas Cadastradas"
      ExtraButton={
        <ThemedButton text="Criar" onPress={() => setCompanyModal(true)} />
      }
    >
      {companyModal && (
        <Modal visible={true} transparent={true} onRequestClose={()=>{setCompanyModal(false)}}>
          <CreateCompany
            closeAction={async () => {
              setCompanyData([]);
              setPaginationData({
                page: 1,
                size: 10,
                count: 0,
                maxPage: 0,
                search: null,
              });
              await AsyncLoadPage(1);
            }}
          />
        </Modal>
      )}

      <FlatList
        data={companyData}
        renderItem={({ item }) => (
          <CompanyItem item={item} key={item.id} redirect />
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

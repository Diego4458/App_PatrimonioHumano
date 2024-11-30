import PageComponent from "@/Components/Dashboard/PageComponent";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import PaginationMetaStructure from "@/Structure/PaginationMetaStructure";
import PaginationResponseStructure from "@/Structure/PaginationResponseStructure";
import ApointmentStructure from "@/Structure/ApointmentStructure";
import apiClient from "@/utils/apiClient";
import { ActivityIndicator, FlatList } from "react-native";
import ApointmentItem from "@/Components/Dashboard/Apointment/ApointmentItem";

export default function GridExample() {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [paginationData, setPaginationData] = useState<PaginationMetaStructure>(
    {
      page: 1,
      size: 10,
      count: 0,
      maxPage: 0,
      search: null,
    }
  );
  const [apointmentsData, setApointmentsData] = useState<ApointmentStructure[]>(
    []
  );

  const AsyncLoadPage = async (page: number) => {
    if (
      isLoading ||
      (paginationData.maxPage > 0 && page > paginationData.maxPage)
    )
      return;
    setIsLoading(true);
    try {
      var Result = await apiClient.get<
        PaginationResponseStructure<ApointmentStructure>
      >("/apointments/next", {
        params: {
          ...paginationData,
          page,
        },
      });

      if(Result?.data?.Content)
      {
        setApointmentsData((pref) => {
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
    <PageComponent text="Próximas Consultas">
      <FlatList
        data={apointmentsData}
        renderItem={({ item }) => <ApointmentItem item={item} key={item.id} />}
        showsVerticalScrollIndicator={false}
        onEndReached={async () => {
          await AsyncLoadPage(paginationData.page + 1);
        }}
        ListFooterComponent={() => isLoading && <ActivityIndicator />}
      />
    </PageComponent>
  );
}

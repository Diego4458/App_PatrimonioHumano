import ThemedButton from "@/Components/ThemedButton";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Card from "../Card";
import { useEffect, useState } from "react";
import ApointmentInterviewedStructure from "@/Structure/ApointmentInterviewedStructure";

import apiClient from "@/utils/apiClient";
import ApiResponseStructure from "@/Structure/ApiResponseStructure";

interface Props {
  id: any;
  onRequestUpdate: any;
  onRequestClose: any;
}

export default function SearchClientsModal({
  id,
  onRequestClose,
  onRequestUpdate,
}: Props) {
  const [isloaded, setIsLoaded] = useState(false);
  const [data, setdata] = useState<ApointmentInterviewedStructure[] | null>(
    null
  );

  const loadInterviewedList = async () => {
    if (!setIsLoaded) return;
    setIsLoaded(true);
    var Result = await apiClient.get<
      ApiResponseStructure<ApointmentInterviewedStructure>
    >(`/apointment/${id}/avaible`);

    if (Result?.data?.Content) {
      setdata(Result.data.Content);
    }
  };

  const sendAddClient = async (user:any) => {
    var Result = await apiClient.post<
      ApiResponseStructure<ApointmentInterviewedStructure>
    >(`/apointment/${id}/${user.id}`);

    if (Result?.data?.Content) {
      onRequestUpdate();
      setIsLoaded(false);
      loadInterviewedList();
    }
  }

  useEffect(() => {
    loadInterviewedList();
  }, [id]);

  return (
    <Modal animationType="slide" visible={true} transparent={true} onRequestClose={onRequestClose}>
      <View style={styles.modalContainer}>
        {!isloaded && <ActivityIndicator size={"large"} />}
        <Card style={{ flexDirection: "column", minWidth: "80%",height: '80%' }}>
          {data && (
            <FlatList
              style={{ marginVertical: 10 }}
              data={data}
              renderItem={({ item }) => (
                <View style={styles.itemData} key={item.id}>
                  <View>
                  <Text style={styles.ClientText}>{item.name}</Text>
                  <Text >{item.document}</Text>
                  </View>
                  
                  <TouchableOpacity style={styles.Button} onPress={()=>{sendAddClient(item)}}>
                    <Text style={styles.loginButtonText}>Adicionar</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
          <ThemedButton text="Fechar" onPress={onRequestClose}/>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  ClientText:{
    fontSize: 20,
    marginVertical: 'auto'
  },
  itemData: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#c8e1ff",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5
  },
  Button: {
    backgroundColor: "#005acd",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  loginButtonText: {
    color: "#f5ffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

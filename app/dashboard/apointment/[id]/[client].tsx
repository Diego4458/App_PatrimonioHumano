import ApiResponseStructure from "@/Structure/ApiResponseStructure";
import FileDetailsStructure from "@/Structure/FileDetailsStructure";
import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import apiClient from "@/utils/apiClient";
import { useAuth } from "@/app/context/AuthContext";
import * as DocumentPicker from "expo-document-picker";
import ThemedButton from "@/Components/ThemedButton";
import FileItem from "@/Components/Dashboard/Apointment/FileItem";

export default function AppointmentFiles() {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [content, setcontent] = useState<FileDetailsStructure[] | null>([]);
  const { id, client } = useLocalSearchParams();

  const AsyncLoadPage = async () => {
    if (isLoading || !authState?.authenticated) return;
    setIsLoading(true);
    try {
      var Result = await apiClient.get<
        ApiResponseStructure<FileDetailsStructure[]>
      >(`/apointment/${id}/${client}/files`);

      if (Result?.data?.Content) {
        setcontent(Result.data.Content);
      } else {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.navigate("/dashboard/apointment");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    AsyncLoadPage();
  }, [client, authState]);

  const pickDocument = async () => {
    setIsUploading(true);
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (
      !result.canceled &&
      result.assets.length >= 1 &&
      (result.assets[0] || result.assets[0].file)
    ) {
      var file = result.assets[0]?.file ?? result.assets[0];

      var Response: any = null;

      if (Platform.OS != "web") {
        const formdata = new FormData();
        formdata.append("uploaded_file", {
          ...file,
          uri: file.uri,
          type: file.mimeType,
          name: file.name,
        });
        Response = await apiClient.post<
          ApiResponseStructure<FileDetailsStructure>
        >(`/apointment/${id}/${client}/files`, formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          transformRequest: (data: unknown) => data,
        });
      } else {
        Response = await apiClient.postForm<
          ApiResponseStructure<FileDetailsStructure>
        >(`/apointment/${id}/${client}/files`, {
          uploaded_file: result.assets[0].file,
        });
      }

      if (Response?.data?.Content) {
        setcontent((prev) => {
          return [...prev!, Response.data.Content];
        });
      }
    }

    setIsUploading(false);
  };

  const removeFile = async (item: any, index: any) => {
    var Reponse = await apiClient.delete<ApiResponseStructure<any>>(
      `/apointment/${id}/${client}/${item.id}`
    );
    if (Reponse?.data?.Content) setcontent(content!.filter((s) => s !== item));
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!content) {
    return <Text>Conteudo Não Encontrado</Text>;
  }

  return (
    <Fragment>
      {isUploading && (
        <View
          style={{
            position: "absolute",
            zIndex: 100,
            flex: 1,
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            opacity: 0.4,
          }}
        >
          <ActivityIndicator style={{ marginVertical: "auto" }} size="large" />
        </View>
      )}

      <View style={{ margin: 5 }}>
        <ThemedButton text="Enviar Arquivo" onPress={pickDocument} />
        <FlatList
          style={{ marginTop: 5 }}
          data={content}
          renderItem={({ item, index }) => (
            <FileItem
              item={item}
              key={item.id}
              callback={() => {
                removeFile(item, index);
              }}
            />
          )}
        />
      </View>
    </Fragment>
  );
}

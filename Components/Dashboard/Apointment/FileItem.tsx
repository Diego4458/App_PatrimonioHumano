import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Card from "../Card";
import FileDetailsStructure from "@/Structure/FileDetailsStructure";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { useAuth } from "@/app/context/AuthContext";

const cardImages = {
  application_msword: require("@/assets/images/fileformats/application_msword.png"),
  application_pdf: require("@/assets/images/fileformats/application_pdf.png"),
  application_zip: require("@/assets/images/fileformats/application_zip.png"),
  image_jpeg: require("@/assets/images/fileformats/image_jpeg.png"),
  image_png: require("@/assets/images/fileformats/image_png.png"),
  text_plain: require("@/assets/images/fileformats/text_plain.png"),
  unknow: require("@/assets/images/fileformats/unknow.png"),
};

interface FileItemProps {
  item: FileDetailsStructure;
  callback?: any;
}

export default function FileItem({ item, callback }: FileItemProps) {
  const [image, setImage] = useState<any>(cardImages.unknow);
  const [isdownloading, setIsDownloading] = useState(false);
  const { authState } = useAuth();

  const beginDownload = async () => {
    if (isdownloading) return;
    setIsDownloading(true);
    try {
      const dirPath = `${FileSystem.cacheDirectory}${item.id}`;
      const dirInfo = await FileSystem.getInfoAsync(dirPath);

      const FilePath = `${FileSystem.cacheDirectory}${item.id}/${item.fileName}`;

      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
      }
      if (!(await FileSystem.getInfoAsync(FilePath)).exists) {
        await FileSystem.downloadAsync(
          `${process.env.EXPO_PUBLIC_API_URL}/secured/${item.fileHash}`,
          FilePath,
          {
            headers: {
              authorization: authState!.token,
            },
          }
        );
      }

      FileSystem.getContentUriAsync(FilePath)
        .then(async (cUri) => {
          await IntentLauncher.startActivityAsync(
            "android.intent.action.VIEW",
            {
              data: cUri,
              flags: 1,
            }
          );
        })
        .catch((error) => {
          alert("Falha ao Abrir arquivo");
        });
    } catch (ex: any) {
      Platform.OS == "web"
        ? alert("Falha ao Baixar Arquivo ou Abrir arquivo")
        : Alert.alert("Falha ao Baixar Arquivo ou Abrir arquivo");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    var translated = item.fileType.replace("/", "_");
    if (cardImages[translated]) {
      setImage(cardImages[translated]);
    }
  }, [item.fileType]);

  return (
    <Card>
      <Image source={image} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.Name}>{item.fileName}</Text>
        <View style={styles.dateTime}>
          <Text style={styles.date}>{item.fileType}</Text>
          <Text style={styles.date}>
            {(item.size / 1000000.0).toFixed(3)} MB
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.iconContainer} onPress={beginDownload}>
        <Text style={styles.icon}>📩</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ ...styles.iconContainer, marginHorizontal: 10 }}
        onPress={callback}
      >
        <Text style={styles.icon}>🗑️</Text>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    padding: 2,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  Name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dateTime: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 10,
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  icon: {
    fontSize: 20,
  },
});

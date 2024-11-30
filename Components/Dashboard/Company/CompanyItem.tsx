import CompanyStructure from "@/Structure/CompanyStructure";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Card from "../Card";
import { router } from "expo-router";

interface CompanyItemProp {
  item?: CompanyStructure;
  redirect?: boolean;
}

export default function CompanyItem({ item, redirect }: CompanyItemProp) {
  return (
    <Card>
      <Image
        source={{
          uri: `${process.env.EXPO_PUBLIC_API_URL}/company/${item!.picHash}`,
        }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={{...styles.Name,textAlign : (redirect ? 'center' : 'right') }}>{item!.name}</Text>
      </View>
      {redirect && (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            router.push({
              pathname: "/dashboard/company/[id]",
              params: {
                id: item?.id,
              },
            });
          }}
        >
          <Text style={styles.icon}>🔎</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    height: "100%",
  },
  Name: {
    fontSize: 18,
    fontWeight: "bold",
    alignContent: "center",
    color: "#333",
    flex: 1,
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

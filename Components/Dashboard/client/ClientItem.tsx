import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Card from "../Card";
import { router } from "expo-router";
import ApointmentInterviewedStructure from "@/Structure/ApointmentInterviewedStructure";

interface Prop {
  item?: ApointmentInterviewedStructure;
  redirect?: boolean;
}

export default function ClientItem({ item, redirect }: Prop) {
  return (
    <Card style={{ justifyContent: "space-between" }}>
      <View>
        <Text style={styles.Name}>{item!.name}</Text>
        <Text>{item!.document}</Text>
      </View>
      {redirect && (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            router.push({
              pathname: "/dashboard/clients/[id]",
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

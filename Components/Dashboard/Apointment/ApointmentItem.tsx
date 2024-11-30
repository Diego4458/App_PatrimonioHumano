import ApointmentStructure from "@/Structure/ApointmentStructure";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Card from "../Card";

export default function ApointmentItem({
  item,
}: {
  item: ApointmentStructure;
}) {
  const [castedDate] = useState(new Date(item.apointmentDate));

  return (
    <Card>
      <Image
        source={{
          uri: `${process.env.EXPO_PUBLIC_API_URL}/company/${
            item.company!.picHash
          }`,
        }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.Name}>{item.company!.name}</Text>
        <View style={styles.dateTime}>
          <Text style={styles.date}>{castedDate.toLocaleString("pt-BR")}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => {
          router.push({
            pathname: "/dashboard/apointment/[id]",
            params: {
              id: item.id,
            },
          });
        }}
      >
        <Text style={styles.icon}>📤</Text>
      </TouchableOpacity>
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
  },
  Name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dateTime: {
    flexDirection: "row",
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

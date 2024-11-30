import React from "react";
import { StyleSheet, View, Text } from "react-native";

interface PageProps {
  children?: React.ReactNode;
  ExtraButton?: React.ReactNode;
  text?: string | React.ReactNode;
}

export default function PageComponent({ children, ExtraButton, text }: PageProps) {
  return (
    <View style={styles.container}>
      <View style={{...styles.header}}>
        {text?.toString() != "[object Object]" ? (<Text style={styles.headerText}>{text}</Text>):text}
        {ExtraButton && <View style={styles.extraButton}>{ExtraButton}</View>}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    marginBottom: 5,
  },
  headerText: {
    flex: 3, 
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  extraButton: {
    flex: 1, 
    alignItems: "flex-end",
  },
});

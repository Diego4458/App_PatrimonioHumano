import { StyleSheet, View, ViewProps } from "react-native";

interface CustomViewProps extends ViewProps {
  children?: React.ReactNode;
}

export default function Card({ children, style, ...rest }: CustomViewProps) {
  const combinedStyle = StyleSheet.flatten([styles.card,style]);
  return (
    <View style={combinedStyle} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    flexDirection: "row",
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

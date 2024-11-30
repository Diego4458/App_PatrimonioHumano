import { Fragment, useState } from "react";
import { Text, View, StyleSheet, ViewProps, Pressable, PressableProps } from "react-native";

interface CustomViewProps extends PressableProps {
  value: Date;
}

export default function DatePickerComponent({
  value,
  style,
  ...props
}: CustomViewProps) {
  const [modalState, setModalState] = useState(false);
  const combinedStyle = StyleSheet.flatten([style, styles.input]);

  return (
    <Fragment>
      <Pressable style={combinedStyle} {...props} onPress={()=>{
        setModalState(true);
      }} >
        <Text>{value.toLocaleString('pt-BR')}</Text>
      </Pressable>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#005acd",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: "#F9F9F9",
    fontSize: 16,
  },
  error: {
    backgroundColor: "#f44336",
    fontSize: 16,
    color: "#FFEBEE",
    fontFamily: "bold",
    borderColor: "#005acd",
    padding: 4,
    borderWidth: 1,
    paddingHorizontal: 20,
    marginTop: 3,
    borderRadius: 25,
  },
});

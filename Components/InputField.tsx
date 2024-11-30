import { TextInput, Text, View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import AlertComponent, { AlertType } from "./AlertComponent";

type Props = React.ComponentProps<typeof TextInput> & { 
  errorText?: string,
  containerStyle?: StyleProp<ViewStyle>
};

export default function InputField({ errorText, style,containerStyle, ...props }: Props) {
  const combinedStyle = StyleSheet.flatten([style, styles.input]);
  const comtainerStyle = containerStyle ?? styles.container;

  return (
    <View style={comtainerStyle}>
      <TextInput style={combinedStyle} selectionColor={"#005acd"} {...props} />
      {errorText ? <AlertComponent Type={AlertType.Error} Content={errorText} Clossable /> : null}
    </View>
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
});

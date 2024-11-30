import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type Props = React.ComponentProps<typeof TouchableOpacity> & {
    children?: React.ReactNode
    text?: string
};

export default function ThemedButton({ children,text,style, ...props }: Props) {

  const combinedStyle = StyleSheet.flatten([styles.loginButton,style]);

  return (
    <TouchableOpacity style={combinedStyle} {...props}>
      <Text style={styles.loginButtonText}>{ text ?? children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#005acd",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#f5ffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

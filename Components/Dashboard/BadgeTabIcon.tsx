import { View,Text } from "react-native";

interface BadgeIconProps {
  notificationCount: number;
  children?: React.ReactNode;
}

export default function BadgeTabIcon(props: BadgeIconProps) {
  return (
    <View>
      {props.children}
      {props.notificationCount > 0 ? (
        <View
          style={{
            position: "absolute",
            right: 10,
            top: -10,
            backgroundColor: "red",
            borderRadius: 9,
            padding: 5,
            width: 18,
            height: 18,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>{props.notificationCount > 9 ? '+9' : props.notificationCount }</Text>
        </View>
      ) : null}
    </View>
  );
}

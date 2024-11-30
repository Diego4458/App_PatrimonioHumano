import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";

export enum AlertType {
  "Success",
  "Warning",
  "Error",
  "Info",
}

interface Props extends ViewProps {
  Type: AlertType;
  Title?: string | undefined;
  Content: string;
  Clossable?: boolean;
}

export default function AlertComponent({
  Type,
  Title,
  Content,
  Clossable,
}: Props) {
  const [Style, setStyle] = useState(SuccessStyle);
  const [isClosed, setClosed] = useState(false);

  useEffect(() => {
    switch (Type) {
      case AlertType.Warning:
        setStyle(WarningStyle);
        break;
      case AlertType.Success:
        setStyle(SuccessStyle);
        break;
      case AlertType.Error:
        setStyle(ErrorStyle);
        break;
      case AlertType.Info:
        setStyle(InfoStyle);
        break;
    }
  }, [Type]);

  useEffect(() => {
    setClosed(false);
  }, [Content]);

  return (
    <View
      style={{
        display: Clossable && isClosed ? "none" : "flex",
        ...Style.BackGround,
        padding: 10,
        margin: 5,
        flexDirection: "column",
        borderRadius: 5,
      }}
    >
      {Clossable && (
        <TouchableOpacity
          style={{
            right: 10,
            top: 0,
            position: "absolute",
            borderRadius: 5,
          }}
          onPressIn={() => {
            setClosed(true);
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "white",
              fontSize: 30,
            }}
          >
            ×
          </Text>
        </TouchableOpacity>
      )}
      <View>
        {Title && (
          <Text style={{ color: "white", fontWeight: "bold" }}>{Title}</Text>
        )}
        <Text style={{ color: "white", fontWeight: "bold" }}>{Content}</Text>
      </View>
    </View>
  );
}

const SuccessStyle = StyleSheet.create({
  BackGround: {
    backgroundColor: "#04AA6D",
  },
});

const WarningStyle = StyleSheet.create({
  BackGround: {
    backgroundColor: "#ff9800",
  },
});

const ErrorStyle = StyleSheet.create({
  BackGround: {
    backgroundColor: "#f44336",
  },
});

const InfoStyle = StyleSheet.create({
  BackGround: {
    backgroundColor: "#2196F3",
  },
});

import { Stack } from "expo-router";

export default function UserLayout() {
  return <Stack>
    <Stack.Screen
      name="index"
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="settings"
      options={{
        title: "Configurações",
      }}
    />
  </Stack>;
}

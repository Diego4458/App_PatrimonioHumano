import { Stack } from "expo-router";

export default function UserLayout() {
  return <Stack initialRouteName="index" >
    <Stack.Screen
      name="index"
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="[id]"
      options={{
        title: "Dados",
        headerBackButtonMenuEnabled: true
      }}
    />
  </Stack>;
}

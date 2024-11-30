import { Stack } from "expo-router";

export default function ApointmentLayout() {
  return <Stack>
    <Stack.Screen
      name="index"
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="[id]/index"
      options={{
        title: "Agendamento"
      }}
    />
    <Stack.Screen name="[id]/[client]" options={{
      title:"Arquivos"
    }} />
  </Stack>;
}

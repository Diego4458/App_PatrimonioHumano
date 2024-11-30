import { Tabs } from "expo-router";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import BadgeTabIcon from "@/Components/Dashboard/BadgeTabIcon";

export default function dashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#005acd",
      }}
    >
      <Tabs.Screen
        name="apointment"
        options={{
          title: "Agendamentos",
          href: '/dashboard/apointment',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={16} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="company"
        options={{
          title: "Empresas",
          href: '/dashboard/company',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={16} name="address-book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: "Clientes",
          href: '/dashboard/clients',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={16} name="users" color={color} />
          )
        }}
        />
        
            {/* <BadgeTabIcon notificationCount={999}> */}
      <Tabs.Screen
        name="user"
        options={{
          title: "Usuario",
          href: '/dashboard/user',
          tabBarIcon: ({ color }) => (
              <FontAwesome size={16} name="user" color={color} />
          )
        }}
      />
    </Tabs>
  );
}

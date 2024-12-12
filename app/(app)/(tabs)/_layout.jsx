import { Tabs } from 'expo-router';
import { AntDesign, FontAwesome5, Ionicons, FontAwesome,MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useNavigation } from 'expo-router';

export default function TabLayout() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'gray',
            tabBarShowLabel: true,
            tabBarStyle: {
                backgroundColor: '#002339',
                position: 'absolute',
                paddingVertical: 10,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                height: 60,
                justifyContent: 'center',
                alignSelf: 'center',
            }
        }}>
            <Tabs.Screen
                name="Home"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />
                }}
            />

            <Tabs.Screen
                name="Explore"
                options={{
                    title: 'Explore',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Ionicons name="planet-outline" size={24} color={color} />
                }}
            />

            <Tabs.Screen
                name="Feed"
                options={{
                    title: 'Feed',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <MaterialIcons name="feed" size={24} color={color} />
                }}
            />

            <Tabs.Screen
                name="Profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <FontAwesome name="user-o" size={24} color={color} />
                }}
            />
        </Tabs>
    );
}
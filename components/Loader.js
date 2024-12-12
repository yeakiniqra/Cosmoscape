import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

export default function Loader() {
    const loadingText = [
        "Space is vast, please wait...",
        "Loading the universe...",
        "Exploring the cosmos...",
        "Please wait, we're almost there...",
    ]

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{loadingText[Math.floor(Math.random() * loadingText.length)]}</Text>
            <LottieView
                source={require('../assets/images/spaceload.json')}
                autoPlay
                loop
                style={styles.lottie}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    lottie: {
        width: 150,
        height: 150,
    },
})
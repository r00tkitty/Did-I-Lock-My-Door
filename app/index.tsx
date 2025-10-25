import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Home() {
    const [locked, setLocked] = useState(false);
    return (
        <View style={[styles.container, locked && styles.containerLocked]}>
            <Pressable onPress={() => setLocked(!locked)} style={styles.button}>
                <Text style={styles.text}>
                    {locked ? "The door is locked" : "The door has not been locked yet."}
                    </Text>
            </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red",
    },
    containerLocked: {
        backgroundColor: "green",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        padding: 20,
        backgroundColor: "#111",
        borderRadius: 12,
    },
    text: {
        color: "#fff",
    },
});

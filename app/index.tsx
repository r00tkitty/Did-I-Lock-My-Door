import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const [locked, setLocked] = useState(false);
  // Load lock state from AsyncStorage on component mount
  useEffect(() => {
    (async () => {
        try {
            const saved = await AsyncStorage.getItem("lockState");
            if (saved !== null) {
                setLocked(JSON.parse(saved));
            }
        } catch (error) {
            console.error("Error loading lock state:", error);
        }
    })();
  }, []);

    // Save lock state to AsyncStorage whenever it changes
    useEffect(() => {
        (async () => {
            try {
                await AsyncStorage.setItem("lockState", JSON.stringify(locked));
            } catch (error) {
                console.error("Error saving lock state:", error);
            }
        })();
    }, [locked]);

    // UI rendering
  return (
    <View style={[styles.container, locked && styles.containerLocked]}>
      <Pressable
        onPress={() => setLocked(!locked)}
        style={[styles.button, locked && styles.buttonLocked]}
      >
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
  },
  button: {
    padding: 20,
    backgroundColor: "#111",
    borderRadius: 12,
  },
  buttonLocked: {
    backgroundColor: "#222",
  },

  text: {
    color: "#fff",
  },
});

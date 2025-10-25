// --- imports ---
import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDistanceToNow, format, set } from "date-fns";


// --- component entry point ---
export default function Home() {
  // Type for our saved state: a boolean + optional timestamp string
  type DoorState = {
    locked: boolean;
    lastLockedAt: string | null;
  };
  const [timeTick, setTimeTick] = useState(0);

  // Initialize React state (memory copy of our saved data)
  const [doorState, setDoorState] = useState<DoorState>({
    locked: false,
    lastLockedAt: null,
  });

  // -------------------------------------------------------------
  // LOAD PHASE: read saved state from AsyncStorage when app opens
  // -------------------------------------------------------------

  useEffect(() => {
  if (!doorState.lastLockedAt) return; // nothing to track yet

  const lockedDate = new Date(doorState.lastLockedAt);
  const now = new Date();
  const diffSeconds = (now.getTime() - lockedDate.getTime()) / 1000;

  // if < 60 s since locked → tick every second, else every minute
  const intervalMs = diffSeconds < 60 ? 1000 : 60000;

  const interval = setInterval(() => setTimeTick((t) => t + 1), intervalMs);

  return () => clearInterval(interval);
}, [doorState.lastLockedAt, timeTick]);

    useEffect(() => {
    async function loadDoorState() {
      try {
        const saved = await AsyncStorage.getItem("doorState");
        // if nothing saved yet, skip
        if (saved) {
          const parsed: DoorState = JSON.parse(saved);
          setDoorState(parsed);
        }
      } catch (error) {
        console.error("Error loading door state:", error);
      }
    }

    loadDoorState(); // run once on mount
  }, []); // empty deps => only on first render

  // -------------------------------------------------------------
  // SAVE PHASE: whenever doorState changes, persist to AsyncStorage
  // -------------------------------------------------------------
  useEffect(() => {
    async function saveDoorState() {
      try {
        await AsyncStorage.setItem("doorState", JSON.stringify(doorState));
      } catch (error) {
        console.error("Error saving door state:", error);
      }
    }

    saveDoorState();
  }, [doorState]); // depend on doorState so it updates each toggle

  // -------------------------------------------------------------
  // UI: render view, status text, and toggle button
  // -------------------------------------------------------------
  return (
    <View
      style={[styles.container, doorState.locked && styles.containerLocked]}
    >
{/* Status text */}
<Text style={styles.statusText}>
  {doorState.locked ? (
    (() => {
      if (!doorState.lastLockedAt) return "Yes, your door is locked.";
      
      const lockedDate = new Date(doorState.lastLockedAt);
      const timeAgo = formatDistanceToNow(lockedDate, { addSuffix: true });
      const now = new Date();
      const diffHours = (now.getTime() - lockedDate.getTime()) / (1000 * 60 * 60);

      return diffHours < 24
        ? `Yes, you locked the door \n ${timeAgo}.`
        : `Yes, your door was locked on ${format(lockedDate, "MMMM do, yyyy h:mma")}.`;
    })()  // 👈 notice these parentheses — this *calls* the function
  ) : (
    "Are you sure you locked the door?"
  )}
</Text>


      {/* Toggle button */}
      <Pressable
        onPress={() =>
          setDoorState({
            locked: !doorState.locked,
            // if we’re locking now, record time; if unlocking, keep old
            lastLockedAt: !doorState.locked
              ? new Date().toISOString()
              : doorState.lastLockedAt,
          })
        }
        style={[styles.button, doorState.locked && styles.buttonLocked]}
      >
        <Text style={styles.text}>
          {doorState.locked ? "Unlock" : "Yes, I Locked The Door."}
        </Text>
      </Pressable>

      {/* Optional reset button for testing */}
      {/* <Pressable
        onPress={async () => {
          await AsyncStorage.removeItem("doorState");
          setDoorState({ locked: false, lastLockedAt: null });
        }}
        style={[styles.button, styles.resetButton]}
      >
        <Text style={styles.text}>Reset Memory</Text>
      </Pressable> */}
    </View>
  );
}

// --- styling block ---
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
    marginTop: 10,
  },
  buttonLocked: {
    backgroundColor: "#222",
  },
  resetButton: {
    backgroundColor: "#333",
  },
  statusText: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
    paddingBottom: 40,
  },
  text: {
    color: "#fff",
    textAlign: "center",
  },
});

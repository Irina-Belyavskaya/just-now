import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import Card from "../constants/Card";
import { FontAwesome } from "@expo/vector-icons";
import Sizes from "../constants/Sizes";

export default function Bottom() {
  return (
    <View style={styles.bottomContainer}>
      <Text style={{ fontSize: 20, color: Colors.white, fontWeight: "bold" }}>
        Complete Profile
      </Text>
      <View style={styles.bottomSection}>
        <Text style={styles.bottomSectionText}>Buy Pro $23.49</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    marginTop: Sizes.medium,
  },
  completeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Sizes.xs,
  },
  card: {
    backgroundColor: Colors.white,
  },
  bottomSection: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: Sizes.medium,
  },
  bottomSectionText: {
    fontWeight: "bold",
    fontSize: Sizes.smedium,
    color: Colors.darkGray,
    borderBottomWidth: 1,
    marginBottom: 5,
    borderBottomColor: Colors.darkGray,
  }
});

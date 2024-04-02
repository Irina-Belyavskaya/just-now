import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import Colors from "../constants/Colors";

export default function ProfileHead() {
  return (
    <View style={styles.main}>
      <View style={styles.imageContainer}>
        <Image 
          style={styles.userImage} 
          source={require("../../assets/user.jpg")}
        />
        <Text style={styles.userName}>
          User Name
        </Text>
        <Text
          style={styles.userEmail}
        >
          user@mail.ru
        </Text>
      </View>

      <View style={styles.middleSectionTextContainer}>
        <View style={styles.middleSectionText}>
          <Text style={styles.toptext}>Friends</Text>
          <Text style={styles.bottomtext}>28</Text>
        </View>
        <View style={styles.middleSectionText}>
          <Text style={styles.toptext}>Photos</Text>
          <Text style={styles.bottomtext}>73</Text>
        </View>
        <View style={styles.middleSectionText}>
        <Text style={styles.toptext}>Video</Text>
              <Text style={styles.bottomtext}>18</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginTop: 30,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  userImage: {
    width: 200, 
    height: 200,
    borderRadius: 100,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: "black"
  },
  userName: {
    fontSize: 30, 
    color: "black", 
    fontWeight: "700", 
    fontFamily: "Raleway_400Regular"
  },
  userEmail: {
    fontSize: 20, 
    color: "black", 
    fontFamily: "Raleway_300Light" 
  },
  middleSectionTextContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  middleSectionText: {
    justifyContent: "center",
    alignItems: "center",
  },
  toptext: {
    fontSize: 18,
    color: "black",
    fontFamily: "Raleway_400Regular",
  },
  bottomtext: {
    fontSize: 18,
    color: "black",
    fontFamily: "Raleway_400Regular",
  },
});

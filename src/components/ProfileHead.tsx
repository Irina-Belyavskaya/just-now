import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import repository from "../repository";
import { User } from "../types/user.type";
import LoaderScreen from "../app/loader";
import { router } from "expo-router";
import Colors from "../constants/Colors";
import { AntDesign } from '@expo/vector-icons';
import { RoleType } from "../types/role.type";

type ProfileHeadProps = {
  userInfo: User,
  numberOfUserFriends?: number,
  numberOfPhotos: number,
  numberOfVideo: number,
  isPersonalAccount?: boolean,
}

export default function ProfileHead({
  userInfo,
  numberOfUserFriends,
  numberOfPhotos,
  numberOfVideo,
  isPersonalAccount = false
}: ProfileHeadProps) {
  return (
    <View style={styles.main}>
      <View style={styles.imageContainer}>
        {isPersonalAccount &&
          <TouchableOpacity
            onPress={() => router.push('/paywall')}
            style={{
              backgroundColor: Colors.black,
              paddingHorizontal: 20,
              paddingVertical: 5,
              borderRadius: 100,
              transform: [{ rotate: '20deg' }],
              marginLeft: 10,
              position: 'absolute',
              right: 65,
              top: 0,
              zIndex: 10,
              display: 'flex',
              flexDirection: 'row',
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontSize: 20,
                color: Colors.white,
                marginRight: 5
              }}
            >
              {userInfo.role.role_type === RoleType.USER_START && 'Upgrade'}
              {userInfo.role.role_type === RoleType.USER_MONTHLY_PRO && 'PRO'}
            </Text>
            {userInfo.role.role_type === RoleType.USER_START &&
              <AntDesign name="star" size={24} color={Colors.white} />
            }
          </TouchableOpacity>
        }
        <Image
          style={styles.userImage}
          source={{ uri: userInfo.file.file_url }}
        />
        <Text style={styles.userName}>
          {userInfo.user_nickname}
        </Text>
        {isPersonalAccount &&
          <Text style={styles.userEmail}>
            {userInfo.user_email}
          </Text>
        }
      </View>
      <View style={styles.middleSectionTextContainer}>
        <View style={styles.middleSectionText}>
          <Text style={styles.toptext}>Friends</Text>
          <Text style={styles.bottomtext}>{numberOfUserFriends}</Text>
        </View>
        {isPersonalAccount
          ?
          <>
            <View style={styles.middleSectionText}>
              <Text style={styles.toptext}>Photos</Text>
              <Text style={styles.bottomtext}>{numberOfPhotos}</Text>
            </View>
            <View style={styles.middleSectionText}>
              <Text style={styles.toptext}>Video</Text>
              <Text style={styles.bottomtext}>{numberOfVideo}</Text>
            </View>
          </>
          :
          <View style={styles.middleSectionText}>
            <Text style={styles.toptext}>Posts</Text>
            <Text style={styles.bottomtext}>{numberOfPhotos + numberOfVideo}</Text>
          </View>
        }

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

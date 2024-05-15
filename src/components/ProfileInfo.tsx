import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useAuth } from "../context/auth-context";
import repository from "../repository";
import { User } from "../types/user.type";
import { router } from "expo-router";
import Colors from "../constants/Colors";
import { AntDesign } from '@expo/vector-icons';
import { RoleType } from "../types/role.type";
import ModalWindowWithCancel from "./ModalWindowWithCancel";
import { useAppDispatch } from "../redux/hooks";
import { setUserInfo } from "../redux/user/user.reducer";

type ProfileInfoProps = {
  userInfo: User,
  numberOfUserFriends?: number,
  numberOfPhotos: number,
  numberOfVideo: number,
  isPersonalAccount?: boolean,
}

export default function ProfileInfo({
  userInfo,
  numberOfUserFriends,
  numberOfPhotos,
  numberOfVideo,
  isPersonalAccount = false
}: ProfileInfoProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const roleType = userInfo.role.role_type;
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const handleYesPressed = async () => {
    const { data: updatedUser } = await repository.put(
      `/users/upgrade/${user}`,
      { role_type: RoleType.USER_START }
    )
    dispatch(setUserInfo(updatedUser));
    setModalVisible(false);
  }

  return (
    <View style={styles.main}>
      {isPersonalAccount && roleType === RoleType.USER_START &&
        <TouchableOpacity
          onPress={() => router.push('/paywall')}
          style={styles.btnSubscription}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontSize: 20,
              color: Colors.white,
              marginRight: 5,
              textAlign: 'center'
            }}
          >
            Upgrade
          </Text>
          <AntDesign name="star" size={24} color={Colors.white} />
        </TouchableOpacity>
      }
      {isPersonalAccount && roleType === RoleType.USER_MONTHLY_PRO &&
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.btnSubscription}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontSize: 20,
              color: Colors.white,
              marginRight: 5,
              textAlign: 'center'
            }}
          >
            Unsibscribe
          </Text>
        </TouchableOpacity>
      }
      <View style={styles.imageContainer}>
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

      <ModalWindowWithCancel
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleYesPressed={handleYesPressed}
        handleNoPressed={() => setModalVisible(false)}
        text={'Are you sure you want to unsibscribe?'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    // marginTop: 30,
  },
  btnSubscription: {
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 100,
    width: '50%',
    position: 'relative',
    bottom: 15,
    left: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
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
    borderColor: Colors.darkBlue
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

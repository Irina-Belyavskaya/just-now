import Colors from "@/src/constants/Colors";
import { Stack, router } from "expo-router";
import { Dispatch, useState } from "react";
import { Modal, Pressable, View, StyleSheet, Text } from "react-native";
import LoaderScreen from "../app/loader";

type ModalWindowWithCancelProps = {
  modalVisible: boolean,
  setModalVisible: Dispatch<React.SetStateAction<boolean>>,
  handleYesPressed: () => void,
  handleNoPressed: () => void,
  text: string,
  isLoading?: boolean
}

export default function ModalWindowWithCancel({
  modalVisible,
  setModalVisible,
  handleYesPressed,
  handleNoPressed,
  text,
  isLoading = false
}: ModalWindowWithCancelProps) {
  return (
    <View style={styles.centeredView}>
      <Stack.Screen options={{ headerStyle: { backgroundColor: Colors.darkBlue } }} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          router.replace("/profile");
        }}
      >
        {isLoading && <LoaderScreen />}
        {!isLoading &&
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { width: '90%' }]}>
              <Text style={styles.modalText}>
                {text}
              </Text>
              <View style={styles.buttonsWrap}>
                <Pressable
                  style={[styles.button, styles.buttonNo]}
                  onPress={handleNoPressed}>
                  <Text style={styles.textStyle}>No</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonYes]}
                  onPress={handleYesPressed}>
                  <Text style={styles.textStyle}>Yes</Text>
                </Pressable>
              </View>
            </View>
          </View>
        }
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: Colors.lightBlue,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonsWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonNo: {
    backgroundColor: Colors.deniedColor,
  },
  buttonYes: {
    backgroundColor: Colors.acceptColor,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Raleway_400Regular'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Raleway_400Regular'
  },
});

import { Modal, Pressable, View, StyleSheet, Text } from "react-native";

type ModalWindowProps = {
  modalVisible: boolean,
  message: string,
  handleCloseModalWindow: () => void
}

export default function ModalWindow({ modalVisible, handleCloseModalWindow, message }: ModalWindowProps) {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { width: '90%' }]}>
            <Text style={styles.modalText}>
              {message}
            </Text>
            <Pressable
              style={[styles.button, styles.buttonOk]}
              onPress={handleCloseModalWindow}
            >
              <Text style={styles.textStyle}>Ok</Text>
            </Pressable>
          </View>
        </View>
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
  button: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  buttonOk: {
    backgroundColor: '#4CBB17',
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
    fontFamily: 'Raleway_400Regular',
    fontSize: 18
  },
});
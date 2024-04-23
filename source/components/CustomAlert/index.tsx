import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import { Text } from "native-base";
import { theme } from "../../../utils/theme";

interface Props {
  visible: boolean;
  closeAlert: () => void;
  title: string;
  sucess: boolean;
}

export function CustomAlert({ visible, closeAlert, title, sucess }: Props) {
  return (
    <View style={styles.container}>
      <AwesomeAlert
        show={visible}
        showProgress={false}
        title={title}
        titleStyle={{
          textAlign: "center",
        }}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Ok"
        confirmButtonColor={sucess ? theme.colors.green_dark : "#DD6B55"}
        onConfirmPressed={() => {
          closeAlert();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  button: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: "#AEDEF4",
  },
  text: {
    color: "#fff",
    fontSize: 15,
  },
});

import { StyleSheet } from "react-native";
import { theme } from "../../../utils/theme";

export const styles = StyleSheet.create({
  container: {},
  button: {
    width: 133,
    height: 48,
    backgroundColor: theme.colors.green_dark,
    justifyContent: "center",
    borderRadius: 16,
  },
  buttonAlt: {
    width: 133,
    height: 48,
    backgroundColor: theme.colors.green_light,
    justifyContent: "center",
    borderRadius: 16,
  },
  buttonRed: {
    width: 133,
    height: 48,
    backgroundColor: theme.colors.red,
    justifyContent: "center",
    borderRadius: 16,
  },
});

import { store } from "react-notifications-component";

export const showNotification = ({
  _title,
  type = "success",
  msg,
  timeout = 5000,
}) => {
  store.addNotification({
    title: _title,
    message: msg,
    type: "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: timeout,
      onScreen: true,
    },
  });
};

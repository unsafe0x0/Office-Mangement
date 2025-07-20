"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider = () => {
  return (
    <ToastContainer theme="dark" position="bottom-right" autoClose={2000} />
  );
};

export default ToastProvider;

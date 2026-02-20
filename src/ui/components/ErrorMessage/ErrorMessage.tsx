// filepath: src/ui/components/ErrorMessage/ErrorMessage.tsx
import React, { FunctionComponent } from "react";
import $ from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return <div className={$.errorMessage}>{message}</div>;
};

export default ErrorMessage;
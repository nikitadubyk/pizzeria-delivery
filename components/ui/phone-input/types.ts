import { type InputWrapperProps } from "@mantine/core";
import type { Value } from "react-phone-number-input/input";

export type PhoneInputValue = Value | undefined;

export type AppPhoneInputProps = {
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  inputClassName?: string;
  value?: PhoneInputValue | string;
  error?: InputWrapperProps["error"];
  label?: InputWrapperProps["label"];
  onChange?: (value: PhoneInputValue) => void;
  description?: InputWrapperProps["description"];
  withAsterisk?: InputWrapperProps["withAsterisk"];
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
};

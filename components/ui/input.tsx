"use client";

import {
  PasswordInput as MantinePasswordInput,
  Textarea as MantineTextarea,
  TextInput as MantineTextInput,
  type PasswordInputProps,
  type TextareaProps,
  type TextInputProps,
} from "@mantine/core";

export function Input(props: TextInputProps) {
  return <MantineTextInput {...props} />;
}

export function Textarea(props: TextareaProps) {
  return <MantineTextarea minRows={4} {...props} />;
}

export function PasswordInput(props: PasswordInputProps) {
  return <MantinePasswordInput {...props} />;
}

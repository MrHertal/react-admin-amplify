import React from "react";
import { ImageInput } from "react-admin";
import { useStorageInput } from "../hooks/useStorageInput";

type Props = {
  source: string;
  multiple?: boolean;
  options?: any;
  storageOptions?: any;
};

export const AmplifyImageInput: React.FC<Props> = ({
  options = {},
  storageOptions = {},
  children,
  ...props
}) => {
  const { onDropAccepted, onRemove } = useStorageInput({
    source: props.source,
    multiple: props.multiple,
    onDropAcceptedCallback: options.onDropAccepted,
    onRemoveCallback: options.onRemove,
    storageOptions,
    children,
  });

  return (
    <ImageInput {...props} options={{ ...options, onDropAccepted, onRemove }}>
      {children}
    </ImageInput>
  );
};

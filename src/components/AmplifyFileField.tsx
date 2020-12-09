import React from "react";
import { FileField, FileFieldProps } from "react-admin";
import { useStorageField } from "../hooks/useStorageField";

type Props = {
  source?: string;
  record?: any;
  storageOptions?: any;
} & FileFieldProps;

export const AmplifyFileField: React.FC<Props> = ({
  source,
  record = {},
  storageOptions = {},
  ...props
}) => {
  const fieldProps = useStorageField({ source, record, storageOptions });

  if (!fieldProps) {
    return null;
  }

  return <FileField {...fieldProps} {...props} />;
};

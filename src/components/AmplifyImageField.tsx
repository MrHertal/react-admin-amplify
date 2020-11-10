import React from "react";
import { ImageField } from "react-admin";
import { useStorageField } from "../hooks/useStorageField";

type Props = {
  source?: string;
  record?: any;
  storageOptions?: any;
};

export const AmplifyImageField: React.FC<Props> = ({
  source,
  record = {},
  storageOptions = {},
  ...props
}) => {
  const fieldProps = useStorageField({ source, record, storageOptions });

  if (!fieldProps) {
    return null;
  }

  return <ImageField {...fieldProps} {...props} />;
};

import { Storage } from "@aws-amplify/storage";
import React from "react";
import { useInput } from "react-admin";
import { v4 as uuid } from "uuid";
import { DataProvider } from "../providers/DataProvider";

type OnDropAccepted = (files: File[], event: any) => void;

type Input = {
  source: string;
  multiple?: boolean;
  onDropAcceptedCallback?: OnDropAccepted;
  storageOptions?: any;
};

type Output = {
  onDropAccepted: OnDropAccepted;
};

export function useStorageInput({
  source,
  multiple = false,
  onDropAcceptedCallback,
  storageOptions = {},
}: Input): Output {
  const { input } = useInput({ source });

  React.useEffect(() => {
    if (Array.isArray(input.value) && input.value.length === 0) {
      input.onChange(undefined);
    }
  }, [input]);

  async function onDropAccepted(files: File[], event: any) {
    try {
      const values = await Promise.all(
        files.map(async (file) => {
          const result = (await Storage.put(
            `${uuid().replace(/-/g, "")}_${file.name}`,
            file,
            storageOptions
          )) as any;

          return {
            bucket: DataProvider.storageBucket,
            region: DataProvider.storageRegion,
            key: result.key,
          };
        })
      );

      if (!multiple) {
        input.onChange(values[0]);
        return;
      }

      if (input.value) {
        input.onChange([...input.value, ...values]);
      } else {
        input.onChange(values);
      }
    } catch (e) {
      console.log(e);
      input.onChange(undefined);
    }

    if (onDropAcceptedCallback) {
      onDropAcceptedCallback(files, event);
    }
  }

  return { onDropAccepted };
}

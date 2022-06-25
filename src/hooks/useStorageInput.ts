import { Storage } from "aws-amplify";
import { useEffect } from "react";
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
  const { field } = useInput({ source });

  useEffect(() => {
    if (Array.isArray(field.value) && field.value.length === 0) {
      field.onChange(undefined);
    }
  }, [field]);

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
        field.onChange(values[0]);
        return;
      }

      if (field.value) {
        field.onChange([...field.value, ...values]);
      } else {
        field.onChange(values);
      }
    } catch (e) {
      console.log(e);
      field.onChange(undefined);
    }

    if (onDropAcceptedCallback) {
      onDropAcceptedCallback(files, event);
    }
  }

  return { onDropAccepted };
}

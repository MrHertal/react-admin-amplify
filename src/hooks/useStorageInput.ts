import { Storage } from "@aws-amplify/storage";
import { Children, ReactElement, ReactNode } from "react";
import { useInput } from "react-admin";
import { v4 as uuid } from "uuid";

type OnDropAccepted = (files: File[], event: any) => void;
type OnRemove = (file: any) => void;

type Input = {
  source: string;
  multiple?: boolean;
  onDropAcceptedCallback?: OnDropAccepted;
  onRemoveCallback?: OnRemove;
  storageOptions?: any;
  children: ReactNode;
};

type Output = {
  onDropAccepted: OnDropAccepted;
  onRemove: OnRemove;
};

export function useStorageInput({
  source,
  multiple = false,
  onDropAcceptedCallback,
  onRemoveCallback,
  storageOptions = {},
  children,
}: Input): Output {
  const { input } = useInput({ source });

  async function onDropAccepted(files: File[], event: any) {
    try {
      const values = await Promise.all(
        files.map(async (file) => {
          const { source, title } = (Children.only(children) as ReactElement<
            any
          >).props;

          const transformedFile = {
            rawFile: file,
            [source]: URL.createObjectURL(file),
          };

          if (title) {
            transformedFile[title] = file.name;
          }

          const result = (await Storage.put(
            `${uuid()}-${file.name}`,
            file,
            storageOptions
          )) as any;

          return {
            ...transformedFile,
            s3Key: result.key,
          };
        })
      );

      if (!multiple) {
        if (input.value) {
          try {
            await Storage.remove(input.value.s3Key, {
              level: storageOptions.level || "public",
            });
          } catch (e) {
            console.log(e);
          }
        }

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

  async function onRemove(file: any) {
    try {
      await Storage.remove(file.s3Key, {
        level: storageOptions.level || "public",
      });
    } catch (e) {
      console.log(e);
    }

    if (onRemoveCallback) {
      onRemoveCallback(file);
    }
  }

  return {
    onDropAccepted,
    onRemove,
  };
}

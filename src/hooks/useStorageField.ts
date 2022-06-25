import { Storage } from "aws-amplify";
import { useEffect, useState } from "react";
import { useRecordContext } from "react-admin";

type Input = {
  source?: string;
  record?: any;
  storageOptions?: any;
};

type FieldProps = {
  source: string;
  record: any;
  title: string;
  src?: string;
} | null;

export function useStorageField({
  source,
  record: file = {},
  storageOptions = {},
}: Input): FieldProps {
  const [fieldProps, setFieldProps] = useState<FieldProps>(null);
  const record = useRecordContext();

  useEffect(() => {
    if (!source || !record[source]) {
      return;
    }

    // Case when using the field with an array of files
    if (Array.isArray(record[source])) {
      Promise.all(
        record[source].map(async (value: any) => {
          if (!value.key) {
            return;
          }

          const url = await Storage.get(value.key, storageOptions);

          if (typeof url !== "string") {
            return;
          }

          return {
            ...value,
            _url: url,
            _title: value.key.split(/_(.+)/)[1],
          };
        })
      ).then((values) => {
        const updatedRecord = { ...record };
        updatedRecord[source] = values.filter((v) => !!v);

        setFieldProps({
          source,
          record: updatedRecord,
          title: "_title",
          src: "_url",
        });
      });

      return;
    }

    if (!record[source].key) {
      return;
    }

    // Default case when rendering a single file
    Storage.get(record[source].key, storageOptions).then((url: any) => {
      if (typeof url !== "string") {
        return;
      }

      const updatedRecord = { ...record };
      updatedRecord[source]._url = url;

      setFieldProps({
        source: `${source}._url`,
        record: updatedRecord,
        title: record[source].key.split(/_(.+)/)[1],
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Field within an AmplifyInput
  useEffect(() => {
    if (source || !file.key) {
      return;
    }

    Storage.get(file.key, storageOptions).then((url: any) => {
      if (typeof url !== "string") {
        return;
      }

      const updatedFile = { ...file };
      updatedFile._url = url;

      setFieldProps({
        source: "_url",
        record: updatedFile,
        title: file.key.split(/_(.+)/)[1],
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file.key]);

  return fieldProps;
}

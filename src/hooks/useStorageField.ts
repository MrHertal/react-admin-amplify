import { Storage } from "@aws-amplify/storage";
import React from "react";

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
  record = {},
  storageOptions = {},
}: Input): FieldProps {
  const [fieldProps, setFieldProps] = React.useState<FieldProps>(null);

  React.useEffect(() => {
    async function getUrl(key: string) {
      return await Storage.get(key, storageOptions);
    }

    // Case when using the field within an AmplifyInput
    if (!source) {
      if (!record.key) {
        return;
      }

      getUrl(record.key)
        .then((url) => {
          if (typeof url !== "string") {
            return;
          }

          const updatedRecord = { ...record };
          updatedRecord._url = url;

          setFieldProps({
            source: "_url",
            record: updatedRecord,
            title: record.key.split(/_(.+)/)[1],
          });
        })
        .catch(() => {});

      return;
    }

    if (!record[source]) {
      return;
    }

    // Case when using the field with an array of files
    if (Array.isArray(record[source])) {
      Promise.all(
        record[source].map(async (value: any) => {
          if (!value.key) {
            return;
          }

          const url = await getUrl(value.key);

          if (typeof url !== "string") {
            return;
          }

          return {
            ...value,
            _url: url,
            _title: value.key.split(/_(.+)/)[1],
          };
        })
      )
        .then((values) => {
          const updatedRecord = { ...record };
          updatedRecord[source] = values.filter((v) => !!v);

          setFieldProps({
            source,
            record: updatedRecord,
            title: "_title",
            src: "_url",
          });
        })
        .catch(() => {});

      return;
    }

    if (!record[source].key) {
      return;
    }

    // Default case when rendering a single file
    getUrl(record[source].key)
      .then((url) => {
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
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.key]);

  return fieldProps;
}

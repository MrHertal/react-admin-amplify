import React, { useEffect } from "react";
import { Filter } from "react-admin";

interface Keys {
  [index: string]: {
    hashKey: string;
    sortKey: string;
  };
}

// Extracts hash and sort keys from source props
function getKeys(filters: React.ReactNodeArray): Keys {
  const keys = {};

  for (const filter of filters) {
    if (filter === null || typeof filter !== "object") {
      throw new Error("AmplifyFilter children are invalid");
    }

    const input = filter as any;

    if (!input.props || !input.props.source) {
      throw new Error("AmplifyFilter children are invalid");
    }

    const source = input.props.source;
    const sourceSplit = source.split(".");

    // A dot must seperate the query name and the key name
    if (sourceSplit.length < 2) {
      throw new Error(
        `Source ${source} is not valid because a separation dot is missing`
      );
    }

    const queryName = sourceSplit[0];
    const keyName = sourceSplit[1];

    if (!keys[queryName]) {
      keys[queryName] = {
        hashKey: "",
        sortKey: "",
      };
    }

    // Case when there is only the hash key
    if (sourceSplit.length === 2) {
      if (keys[queryName].hashKey !== "") {
        throw new Error(
          `Source ${source} is not valid because hash key is already defined by another input`
        );
      }

      keys[queryName].hashKey = keyName;

      continue;
    }

    keys[queryName].sortKey = keyName;
  }

  return keys;
}

export const AmplifyFilter: React.FC<{
  defaultQuery: string;
  setQuery?: React.Dispatch<string>;
}> = ({ children, defaultQuery, setQuery = null, ...propsRest }) => {
  let filters;

  if (children !== null && typeof children === "object") {
    filters = [children];
  }

  if (Array.isArray(children)) {
    filters = children;
  }

  if (!filters) {
    throw new Error("AmplifyFilter children are invalid");
  }

  // First checks if children source props are well formatted
  const keys = getKeys(filters);

  const rest = propsRest as any;

  const filterValues = rest.filterValues;
  const setFilters = rest.setFilters;

  // Determines which query will be executed depending on the filter
  let query = defaultQuery;
  if (Object.keys(filterValues).length === 1) {
    query = Object.keys(filterValues)[0];

    const filterHashKey = filterValues[query][keys[query].hashKey];

    // Case when filter values do not contain mandatory hash key
    if (!filterHashKey && setFilters) {
      setFilters({});
    }
  }

  // Tells the list component about the query in order to know which fields are sortable
  useEffect(() => {
    setQuery && setQuery(query);
  }, [query, setQuery]);

  function showFilter(queryName: string) {
    return query === defaultQuery || query === queryName;
  }

  // Checks if filter has a value
  function notBlank(filter: string) {
    return !!filter.split(".").reduce((o, i) => (!o ? o : o[i]), filterValues);
  }

  function renderInput(filter: React.ReactNode) {
    const input = filter as any;

    const source = input.props.source;
    const sourceSplit = source.split(".");

    const queryName = sourceSplit[0];

    if (sourceSplit.length === 2) {
      return showFilter(queryName) && input;
    }

    const hashKeySource = `${queryName}.${keys[queryName].hashKey}`;

    return showFilter(queryName) && notBlank(hashKeySource) && input;
  }

  return <Filter {...rest}>{filters.map(renderInput)}</Filter>;
};

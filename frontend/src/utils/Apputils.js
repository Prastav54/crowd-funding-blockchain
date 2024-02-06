import React from "react";

export const lazyImport = (factory, name) => {
  return Object.create({
    [name]: React.lazy(() =>
      factory().then((module) => ({ default: module[name] }))
    ),
  });
};

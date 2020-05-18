import React from "react";
import { Button } from "@material-ui/core";

export const Dec = ({ onClick, ...rest }: { onClick: () => void }) => {
  return (
    <Button onClick={onClick} {...rest}>
      Decrementa
    </Button>
  );
};

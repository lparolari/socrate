import React from "react";
import { Button } from "@material-ui/core";

export const Reset = ({ onClick, ...rest }: { onClick: () => void }) => {
  return (
    <Button variant="outlined" color="secondary" onClick={onClick} {...rest}>
      Azzera
    </Button>
  );
};

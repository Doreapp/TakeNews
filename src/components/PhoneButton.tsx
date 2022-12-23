/**
 * Phone button component
 *
 * On click, opens the phone app
 */

import React from "react";
import {Button, ButtonProps} from "@mui/material";

export interface PhoneButtonProps extends ButtonProps {
  /** The phone number to call when the button is clicked */
  phoneNumber: string;
}

export default function PhoneButton({
  phoneNumber,
  children,
  ...props
}: PhoneButtonProps): JSX.Element {
  const handleClick = (): void => {
    window.open(`tel:${phoneNumber}`, "_self");
  };

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );
}

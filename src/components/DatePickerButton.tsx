/**
 * Component for a date picker opened via a button
 */

import {Button, ButtonProps, TextField, TextFieldProps} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import React from "react";

export interface DatePickerButtonProps extends ButtonProps {
  /** Callback when the date selected changes */
  onDateChange?: (date: number) => void;

  /** Initial date value */
  date?: number;

  /** Whether to disable dates in the future */
  disableFuture?: boolean;
}

export default function DatePickerButton({
  onDateChange,
  date,
  children,
  disableFuture = false,
  ...buttonProps
}: DatePickerButtonProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [currentDate, setCurrentDate] = React.useState<Dayjs | null>(
    dayjs(date)
  );

  const handleAccept = (date: Dayjs | null): void => {
    setIsOpen(false);
    onDateChange?.(dayjs(date).valueOf());
  };

  return (
    <DatePicker
      open={isOpen}
      disableFuture={disableFuture}
      onClose={() => setIsOpen(false)}
      onAccept={handleAccept}
      value={currentDate}
      onChange={setCurrentDate}
      renderInput={(props: TextFieldProps) => {
        return (
          <>
            <TextField
              {...props}
              style={{opacity: 0, width: 0, height: 0, position: "absolute"}}
            />
            <Button {...buttonProps} onClick={() => setIsOpen(true)}>
              {children}
            </Button>
          </>
        );
      }}
    />
  );
}

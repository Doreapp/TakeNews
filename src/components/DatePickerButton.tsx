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
}

export function DatePickerButton({
  onDateChange,
  date,
  children,
  ...buttonProps
}: DatePickerButtonProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleDateChange = (date: Dayjs | null): void => {
    setIsOpen(false);
    onDateChange?.(dayjs(date).valueOf());
  };

  return (
    <DatePicker
      open={isOpen}
      onClose={() => setIsOpen(false)}
      value={date}
      onChange={handleDateChange}
      renderInput={(props: TextFieldProps) => {
        return (
          <>
            <TextField {...props} style={{opacity: 0, width: 0, height: 0}} />
            <Button {...buttonProps} onClick={() => setIsOpen(true)}>
              {children}
            </Button>
          </>
        );
      }}
    />
  );
}

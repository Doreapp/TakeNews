/**
 * Person views
 */

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControl,
  Alert,
  InputAdornment,
  StandardTextFieldProps,
} from "@mui/material";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import React, {FormEvent, useState} from "react";
import {IPerson} from "../../models";
import "dayjs/locale/fr";
import daysjs, {Dayjs} from "dayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import ContactsPickerButton, {IContact} from "../ContactPickerButton";

interface FieldProps extends StandardTextFieldProps {
  /** Defines the `label` of the textfield, as well as its `id` and `name` */
  name: string;
}

/**
 * Text field for the edit/create dialog
 */
function Field({name, ...other}: FieldProps): JSX.Element {
  return (
    <TextField
      margin="dense"
      fullWidth
      variant="standard"
      label={name}
      name={name.toLowerCase().replaceAll(" ", "-")}
      id={name.toLowerCase().replaceAll(" ", "-")}
      {...other}
    />
  );
}

/**
 * Field for a phone number.
 * Only accept number digits and an optional prefixing `+`.
 */
function PhoneNumberField(props: FieldProps): JSX.Element {
  const [value, setValue] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const inputVal = event.target.value;
    let result = "";
    for (const char of inputVal) {
      if (char === "+" && result === "") {
        result = "+";
      } else if (char.match(/[0-9]/) !== null) {
        result += char;
      }
    }
    setValue(result);
  };

  const handleContactSelected = (contact: IContact): void => {
    if (contact.tel.length > 0) {
      setValue(contact.tel[0].replaceAll(" ", ""));
    }
  };

  return (
    <Field
      {...props}
      value={value}
      onChange={handleChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <ContactsPickerButton
              onContactSelected={handleContactSelected}
              aria-label="select a contact from device's list"
              edge="end"
              multiple={false}>
              <PermContactCalendarIcon />
            </ContactsPickerButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

interface DateFieldProps {
  /** Defines the `label` of the textfield, as well as its `id` and `name` */
  name: string;

  /** Initial date value as a number */
  date?: number;

  [key: string]: any;
}

/**
 * Input field for a date
 */
function DateField({
  name,
  date = undefined,
  ...other
}: DateFieldProps): JSX.Element {
  const [value, setValue] = useState<Dayjs | null>(
    date !== undefined ? daysjs(date) : null
  );
  return (
    <DatePicker
      {...other}
      label={name}
      value={value}
      onChange={setValue}
      disableFuture={true}
      renderInput={(params) => (
        <div>
          <div style={{display: "none"}}>
            <Field name={name} value={value ?? ""} />
          </div>
          <Field
            {...params}
            variant="standard"
            name={`mirror-${name}`}
            label={name}
          />
        </div>
      )}
    />
  );
}

interface EditPersonDialogProps {
  /** The person to edit */
  person?: IPerson;

  /** Whether the dialog is open */
  open: boolean;

  /** Callback on edition/creation cancellation */
  onCancel: () => void;

  /** Callback onedition/creation validation (with new person as param) */
  onValidate: (person: IPerson) => void;
}

/**
 * Dialog to create/edit a person.
 */
export default function EditPersonDialog({
  person,
  open,
  onCancel,
  onValidate,
}: EditPersonDialogProps): JSX.Element {
  const [error, setError] = useState<string | undefined>(undefined);
  const handleValidate = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    /** Get the value of the field named `name` or undefined if empty */
    const get = (name: string): string | undefined => {
      const value = data.get(name);
      if (typeof value === "string" && value.trim() !== "") {
        return value.trim();
      }
      return undefined;
    };

    let lastContact: number | undefined = parseInt(get("last-contact") ?? "");
    if (isNaN(lastContact)) {
      lastContact = undefined;
    }

    const newPerson = {
      ...person,
      nickname: get("nickname"),
      firstname: get("firstname"),
      lastname: get("lastname"),
      phonenumber: get("phone-number"),
      lastcontact: lastContact,
    };

    if (
      newPerson.nickname === undefined &&
      newPerson.firstname === undefined &&
      newPerson.lastname === undefined
    ) {
      setError("At least one of the names must be defined");
      return;
    }

    setError(undefined);
    onValidate(newPerson);
  };

  const editing = person !== undefined;
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{editing ? "Person edition" : "New person"}</DialogTitle>
      {error !== undefined && <Alert severity="error">{error}</Alert>}
      <DialogContent>
        <FormControl
          component="form"
          id="dialog-form"
          onSubmit={handleValidate}>
          <Field
            name="Nickname"
            autoFocus={true}
            defaultValue={person?.nickname}
          />
          <Field name="Firstname" defaultValue={person?.firstname} />
          <Field name="Lastname" defaultValue={person?.lastname} />
          <PhoneNumberField
            name="Phone number"
            defaultValue={person?.phonenumber}
          />
          <DateField
            name="Last contact"
            PopperProps={{
              // Setting an higher z-index for the popper to be above the dialog
              className: "z-[1400]",
            }}
            date={person?.lastcontact}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" form="dialog-form">
          {editing ? "Save changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

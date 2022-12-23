/**
 * Person views
 */

import {
  Button,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  TextField,
  DialogActions,
  FormControl,
  Alert,
  TextFieldProps,
} from "@mui/material";
import React, {FormEvent, useState} from "react";
import {IPerson} from "../models";
import moment from "moment";
import CallIcon from "@mui/icons-material/Call";
import UpdateIcon from "@mui/icons-material/Update";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "dayjs/locale/fr";
import daysjs, {Dayjs} from "dayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {EmptyIcon} from "./icons";
import {PhoneButton} from "./PhoneButton";

/**
 * Return the description of the date relativelly to now
 * @param date Date to consider
 * @returns A string such as '13 days ago'
 */
function dateString(date?: number): string {
  switch (moment.locale()) {
    case "fr":
      return (
        "Dernier contact " +
        (date !== undefined ? moment(date).fromNow() : "il y a bien longtemps")
      );
    case "en":
    default:
      return (
        "Last contact " +
        (date !== undefined ? moment(date).fromNow() : "a long time ago")
      );
  }
}

interface PersonCallbacks {
  /** Callback on click on edit button */
  onEditClicked?: (person: IPerson) => void;

  /** Callback on click on delete button */
  onDeleteClicked?: (person: IPerson) => void;

  /** Callback on update last contact (pass updated person) */
  onUpdateLastContact?: (person: IPerson) => void;
}

interface PersonViewProps extends PersonCallbacks {
  /** Person to display */
  person: IPerson;

  /** Is the person selected */
  selected: boolean;

  /** Callback on click on the person view */
  onClick: () => void;
}

/**
 * View for a single person
 */
export function PersonView({
  person,
  selected = false,
  onClick,
  onEditClicked,
  onDeleteClicked,
  onUpdateLastContact,
}: PersonViewProps): JSX.Element {
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  let officialName = person.firstname;
  if (person.lastname !== undefined) {
    if (officialName !== undefined) {
      officialName += " " + person.lastname;
    } else {
      officialName = person.lastname;
    }
  }

  let mainName, secondaryName;
  if (person.nickname !== undefined) {
    mainName = person.nickname;
    secondaryName = officialName;
  } else {
    mainName = officialName;
  }
  if (secondaryName !== undefined) {
    secondaryName = " — " + secondaryName;
  }

  const handleLastContactChanged = (date: Dayjs | null): void => {
    onUpdateLastContact?.({...person, lastcontact: daysjs(date).valueOf()});
    setDatePickerOpen(false);
  };

  return (
    <div>
      <ListItemButton onClick={onClick}>
        <ListItemText
          primary={
            <React.Fragment>
              {mainName}
              <Typography
                sx={{display: "inline"}}
                component="span"
                variant="body2"
                color="text.secondary">
                {secondaryName}
              </Typography>
            </React.Fragment>
          }
          secondary={dateString(person.lastcontact)}
        />
      </ListItemButton>
      <Collapse in={selected} timeout="auto" unmountOnExit>
        <div className="flex flex-row place-content-around pl-2">
          {person.phonenumber === undefined ? (
            <Button disabled>
              <CallIcon />
            </Button>
          ) : (
            <PhoneButton phoneNumber={person.phonenumber}>
              <CallIcon />
            </PhoneButton>
          )}
          <DatePicker
            open={datePickerOpen}
            onClose={() => setDatePickerOpen(false)}
            value={person.lastcontact}
            onChange={handleLastContactChanged}
            renderInput={(props: TextFieldProps) => {
              return (
                <div>
                  <TextField
                    {...props}
                    style={{opacity: 0, width: 0, height: 0}}
                  />
                  <Button onClick={() => setDatePickerOpen(true)}>
                    <UpdateIcon />
                  </Button>
                </div>
              );
            }}
          />
          <Button onClick={() => onEditClicked?.(person)}>
            <EditIcon />
          </Button>
          <Button onClick={() => onDeleteClicked?.(person)}>
            <DeleteIcon />
          </Button>
        </div>
      </Collapse>
    </div>
  );
}

interface PersonsListProps extends PersonCallbacks {
  /** List of persons */
  persons: IPerson[];
}

/**
 * View of the persons' list
 */
export function PersonsList({
  persons,
  onEditClicked,
  onDeleteClicked,
  onUpdateLastContact,
}: PersonsListProps): JSX.Element {
  const [selection, select] = useState<number>(-1);

  const items: JSX.Element[] = [];
  let index = 0;
  for (const person of persons) {
    const key = index++;
    items.push(
      <PersonView
        key={key}
        person={person}
        onClick={() => select(key === selection ? -1 : key)}
        onEditClicked={onEditClicked}
        onDeleteClicked={onDeleteClicked}
        onUpdateLastContact={onUpdateLastContact}
        selected={key === selection}
      />
    );
  }
  if (items.length === 0) {
    return (
      <div>
        <EmptyIcon className="w-full h-full p-5 mt-10" />
        <Typography variant="body2" align="center">
          Nothing here...
        </Typography>
      </div>
    );
  }
  return <List>{items}</List>;
}

interface FieldProps {
  /** Defines the `label` of the textfield, as well as its `id` and `name` */
  name: string;

  [key: string]: any;
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

  return <Field {...props} value={value} onChange={handleChange} />;
}

interface DateFieldProps extends FieldProps {
  /** Initial date value as a number */
  date?: number;
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
      label={name}
      value={value}
      onChange={setValue}
      renderInput={(params) => (
        <div>
          <div style={{display: "none"}}>
            <Field name={name} value={value ?? ""} />
          </div>
          <Field name={`mirror-${name}`} label={name} {...params} />
        </div>
      )}
      {...other}
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
export function EditPersonDialog({
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

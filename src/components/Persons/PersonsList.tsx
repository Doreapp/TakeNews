/**
 * Person views
 */

import {
  Button,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, {useState} from "react";
import {IPerson} from "../../models";
import moment from "moment";
import CallIcon from "@mui/icons-material/Call";
import UpdateIcon from "@mui/icons-material/Update";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "dayjs/locale/fr";
import {EmptyIcon} from "../icons";
import {PhoneButton} from "../PhoneButton";
import {DatePickerButton} from "../DatePickerButton";

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

  const handleLastContactChanged = (date: number): void => {
    onUpdateLastContact?.({...person, lastcontact: date});
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
          <DatePickerButton
            date={person.lastcontact}
            onDateChange={handleLastContactChanged}>
            <UpdateIcon />
          </DatePickerButton>
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
export default function PersonsList({
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

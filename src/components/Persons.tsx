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
import {IPerson} from "../models";
import moment from "moment";
import CallIcon from "@mui/icons-material/Call";
import UpdateIcon from "@mui/icons-material/Update";
import EditIcon from "@mui/icons-material/Edit";

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

/**
 * View for a single person
 */
export function PersonView({
  person,
  selected = false,
  onClick,
}: {
  person: IPerson;
  selected: boolean;
  onClick: () => void;
}): JSX.Element {
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

  const onCallClicked = (): void => {
    console.log("TODO call the person", person.phonenumber);
  };
  const onUpdateContactClicked = (): void => {
    console.log("TODO update last contact", person.lastcontact);
  };
  const onEditClicked = (): void => {
    console.log("TODO edit person", person);
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
          <Button onClick={onCallClicked}>
            <CallIcon />
          </Button>
          <Button onClick={onUpdateContactClicked}>
            <UpdateIcon />
          </Button>
          <Button onClick={onEditClicked}>
            <EditIcon />
          </Button>
        </div>
      </Collapse>
    </div>
  );
}

/**
 * View of the persons' list
 */
export function PersonsList({persons}: {persons: IPerson[]}): JSX.Element {
  const [selection, select] = useState<number>(-1);
  const items: JSX.Element[] = [];
  let index = 0;
  for (const person of persons) {
    const key = index++;
    items.push(
      <PersonView
        key={key}
        person={person}
        onClick={() => {
          if (key === selection) {
            select(-1);
          } else {
            select(key);
          }
        }}
        selected={key === selection}
      />
    );
  }
  return <List>{items}</List>;
}

/**
 * Person views
 */

import {List, ListItem, ListItemText, Typography} from "@mui/material";
import React from "react";
import {IPerson} from "../models";
import moment from "moment";

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
export function PersonView({person}: {person: IPerson}): JSX.Element {
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
  return (
    <ListItem>
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
    </ListItem>
  );
}

/**
 * View of the persons' list
 */
export function PersonsList({persons}: {persons: IPerson[]}): JSX.Element {
  const items: JSX.Element[] = [];
  let index = 0;
  for (const person of persons) {
    items.push(<PersonView key={index++} person={person} />);
  }
  return <List>{items}</List>;
}

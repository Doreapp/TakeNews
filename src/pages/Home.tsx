/**
 * Home page,
 * displaying persons
 */

import * as React from "react";
import Container from "@mui/material/Container";
import {IPerson} from "../models";
import {PersonsList} from "../components/Persons";

export default function HomePage(): JSX.Element {
  const persons: IPerson[] = [
    {
      nickname: "Just nickname",
      lastcontact: Date.now(),
    },
    {
      nickname: "Nickname",
      firstname: "Firstname",
      lastcontact: Date.parse("25 Dec 2021 00:00:00 GMT"),
    },
    {
      nickname: "Nickname",
      firstname: "Firstname",
      lastname: "Lastname",
    },
    {
      firstname: "Firstname",
      lastname: "Lastname",
    },
    {
      firstname: "Just Firstname",
    },
    {
      lastname: "Just Lastname",
    },
  ];
  return (
    <Container maxWidth="md">
      <PersonsList persons={persons} />
    </Container>
  );
}

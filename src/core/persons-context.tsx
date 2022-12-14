import React, {createContext, useContext} from "react";
import {IPerson} from "../models";

const PERSONS_KEY = "persons";

let nextId = 1;

interface PersonsContextType {
  persons: IPerson[];
  createPerson: (person: IPerson) => IPerson;
  getPersonById: (id: number) => IPerson | undefined;
  updatePerson: (person: IPerson) => void;
  deletePerson: (id: number) => void;
}

/** Persons context */
const PersonsContext = createContext<PersonsContextType>({
  persons: [],
  createPerson: (person: IPerson) => person,
  getPersonById: () => undefined,
  updatePerson: () => {},
  deletePerson: () => {},
});

/**
 * Provider of `PersonsContext`.
 */
export function PersonsProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  /** Retrieve the current list of persons from localStorage */
  function getPersons(): IPerson[] {
    const json = localStorage.getItem(PERSONS_KEY);
    if (json !== null) {
      try {
        return JSON.parse(json);
      } catch (error) {
        console.error("Error while parsing persons from local storage", error);
        return [];
      }
    } else {
      return [];
    }
  }

  const [persons, setPersons] = React.useState<IPerson[]>(getPersons());
  nextId = Math.max(...persons.map((person) => person.id ?? -1)) + 1;

  const debug = (...args: any[]): void => {
    console.debug("[PersonsContext]", ...args);
  };

  /** Save the current list of persons to localStorage */
  function savePersons(persons: IPerson[]): void {
    debug("save persons", persons);
    localStorage.setItem(PERSONS_KEY, JSON.stringify(persons));
    setPersons(persons);
  }

  /** Create a new person */
  function createPerson(person: IPerson): IPerson {
    debug("create new person", person);
    person.id = nextId++;
    const persons = getPersons();
    persons.push(person);
    savePersons(persons);
    return person;
  }

  /** Retrieve a person by ID */
  function getPersonById(id: number): IPerson | undefined {
    const persons = getPersons();
    return persons.find((person) => person.id === id);
  }

  /** Update a person */
  function updatePerson(person: IPerson): void {
    debug("update person", person);
    const persons = getPersons();
    const index = persons.findIndex(
      (storedPerson) => storedPerson.id === person.id
    );
    if (index !== -1) {
      persons[index] = person;
      savePersons(persons);
    } else {
      console.warn(
        "Trying to update a person non-existing in local storage",
        person
      );
    }
  }

  /** Delete a person */
  function deletePerson(id: number): void {
    debug("delete person with id", id);
    const persons = getPersons();
    const index = persons.findIndex((person) => person.id === id);
    if (index !== -1) {
      persons.splice(index, 1);
      savePersons(persons);
    }
  }

  /** Provide the context value */
  const value = {
    persons,
    createPerson,
    getPersonById,
    updatePerson,
    deletePerson,
  };

  return (
    <PersonsContext.Provider value={value}>{children}</PersonsContext.Provider>
  );
}

/** Create a hook for consuming the context */
export function usePersonsContext(): PersonsContextType {
  return useContext(PersonsContext);
}

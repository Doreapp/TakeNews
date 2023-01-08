/**
 * Button component to pick one or more contacts from the device's contact list
 */

import {IconButton, IconButtonProps} from "@mui/material";
import React from "react";

/**
 * A contact from tge contact list
 */
export interface IContact {
  /**
   * Name of the contact
   */
  name: string;

  /**
   * List of phone numbers
   */
  tel: string[];
}

export interface ContactPickerButtonProps extends IconButtonProps {
  /**
   * Callback when several contacts are selected
   */
  onContactsSelected?: (contacts: IContact[]) => void;

  /**
   * Callback when a single contact is selected
   */
  onContactSelected?: (contact: IContact) => void;

  /**
   * Whether to select multiple contact or a single one
   */
  multiple?: boolean;
}

/**
 * Function to pick contacts from the device
 * @param multiple Whether to select multiple contact
 * @returns
 */
async function getContacts(multiple: boolean = true): Promise<IContact[]> {
  const mNavigator: any = navigator;
  const result = await mNavigator.contacts?.select(["name", "tel"], {multiple});
  return result;
}

/**
 * Button to pick contacts from the device contact list
 */
export default function ContactsPickerButton({
  onContactsSelected,
  onContactSelected,
  multiple = true,
  children,
  ...props
}: ContactPickerButtonProps): JSX.Element {
  const handleClick = (): void => {
    getContacts(multiple)
      .then((contacts: IContact[]) => {
        if (contacts.length > 0) {
          if (multiple) {
            onContactsSelected?.(contacts);
          } else {
            onContactSelected?.(contacts[0]);
          }
        }
      })
      .catch((err) => {
        console.warn("Error while picking contacts", err);
      });
  };

  if (!("contacts" in navigator)) {
    return <></>;
  }

  return (
    <IconButton {...props} onClick={handleClick}>
      {children}
    </IconButton>
  );
}

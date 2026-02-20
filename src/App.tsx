import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import useForm from "@/components/Form/UseForm";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

function App() {
  const { values, handleChange, resetForm, setValues } = useForm({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });

  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [addressLoading, setAddressLoading] = React.useState(false);
  const { addAddress } = useAddressBook();

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setAddresses([]);

    if (!values.postCode || !values.houseNumber) {
      setError("Post code and house number fields are mandatory!");
      return;
    }

    setAddressLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
      const url = `${baseUrl}/api/getAddresses?postcode=${values.postCode}&streetnumber=${values.houseNumber}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        setError(data.errormessage || "Failed to fetch addresses");
        return;
      }

      if (data.details && Array.isArray(data.details)) {
        setAddresses(data.details);
        setValues((prev) => ({ ...prev, selectedAddress: "" }));
      }
    } catch (err) {
      setError("An error occurred while fetching addresses");
    } finally {
      setAddressLoading(false);
    }
  };

  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!values.firstName || !values.lastName) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!values.selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === values.selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName: values.firstName, lastName: values.lastName });
    resetForm();
    setAddresses([]);
    setError(undefined);
  };

  const handleClearAll = () => {
    resetForm();
    setAddresses([]);
    setError(undefined);
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        <form onSubmit={handleAddressSubmit}>
          <fieldset>
            <legend>🏠 Find an address</legend>
            <div className={styles.formRow}>
              <InputText
                name="postCode"
                onChange={handleChange}
                placeholder="Post Code"
                value={values.postCode}
              />
            </div>
            <div className={styles.formRow}>
              <InputText
                name="houseNumber"
                onChange={handleChange}
                value={values.houseNumber}
                placeholder="House number"
              />
            </div>
            <Button type="submit" loading={addressLoading}>
              Find
            </Button>
          </fieldset>
        </form>
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {values.selectedAddress && (
          <form onSubmit={handlePersonSubmit}>
            <fieldset>
              <legend>✏️ Add personal info to address</legend>
              <div className={styles.formRow}>
                <InputText
                  name="firstName"
                  placeholder="First name"
                  onChange={handleChange}
                  value={values.firstName}
                />
              </div>
              <div className={styles.formRow}>
                <InputText
                  name="lastName"
                  placeholder="Last name"
                  onChange={handleChange}
                  value={values.lastName}
                />
              </div>
              <Button type="submit">Add to addressbook</Button>
            </fieldset>
          </form>
        )}

        <ErrorMessage message={error} />

        <Button onClick={handleClearAll} variant="secondary">
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;

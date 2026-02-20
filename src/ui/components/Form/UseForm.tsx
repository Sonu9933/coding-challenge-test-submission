import React from "react";

interface FormFields {
  [key: string]: string;
}

export default function useForm(initialValues: FormFields) {
  const [values, setValues] = React.useState(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  return {
    values,
    handleChange,
    resetForm,
    setValues,
  };
}
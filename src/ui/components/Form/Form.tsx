import React, { FunctionComponent } from "react";
import { InputHTMLAttributes } from "react";

import Button from "../Button/Button";
import $ from "./Form.module.css";
import InputText from "../InputText/InputText";

interface FormEntry {
  name: string;
  placeholder: string;
  extraProps?: InputHTMLAttributes<HTMLInputElement>;
}

interface FormProps {
  label: string;
  loading: boolean;
  formEntries: FormEntry[];
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitText: string;
}

const Form: FunctionComponent<FormProps> = ({
  label,
  loading,
  formEntries,
  onFormSubmit,
  submitText,
}) => {
  return (
    <form onSubmit={onFormSubmit}>
      <fieldset>
        <legend>{label}</legend>
        {formEntries.map(({ name, placeholder, extraProps }, index) => {
          const { value, onChange, ...rest } = extraProps || {};
          const safeValue =
            value === undefined || value === null ? "" : String(value);
          return (
            <div key={`${name}-${index}`} className={$.formRow}>
              <InputText
                name={name}
                placeholder={placeholder}
                value={safeValue}
                onChange={onChange as any}
                {...(rest as any)}
              />
            </div>
          );
        })}

        <Button loading={loading} type="submit">
          {submitText}
        </Button>
      </fieldset>
    </form>
  );
};

export default Form;

interface FormFields {
  [key: string]: string;
}

export function useForm(initialValues: FormFields) {
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

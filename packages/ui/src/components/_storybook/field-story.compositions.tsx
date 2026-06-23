import { useState } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "../field";
import { Input } from "../input";

/** Live validation demo — blur-triggered error on Employee ID format. */
export function ValidatedEmployeeIdField() {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const invalid = touched && value.length < 4;

  return (
    <Field state={invalid ? "error" : "ready"}>
      <FieldLabel htmlFor="emp-id">Employee ID *</FieldLabel>
      <Input
        id="emp-id"
        onBlur={() => setTouched(true)}
        onChange={(event) => setValue(event.target.value)}
        placeholder="EMP-0000"
        value={value}
      />
      <FieldDescription>Format: EMP- followed by 4 digits.</FieldDescription>
      {invalid ? (
        <FieldError
          errors={[{ message: "Employee ID must be at least 4 characters" }]}
        />
      ) : null}
    </Field>
  );
}

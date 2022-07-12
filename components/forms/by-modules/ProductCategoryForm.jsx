import React from "react";
import {
  Button,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import { useForm } from "react-hook-form";

export const ProductCategoryForm = (props) => {
  const { formFns, values } = props;

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (formValues) => {
    await formFns.formSubmitFn(formValues);
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <Form.Group className="form-group">
        <FloatingLabel label="Name">
          <Form.Control
            type="text"
            className={
              Boolean(errors && errors.name?.type === "required")
                ? "border border-danger"
                : ""
            }
            {...register("name", { required: true })}
            defaultValue={values?.name}
            placeholder="Name"
          />
        </FloatingLabel>
      </Form.Group>

      <Button type="submit">SUBMIT CATEGORY</Button>
    </Form>
  );
};

import React from 'react';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import moment from 'moment';

export const EmployeePayslipForm = (props) => {
  const { formFns, values, employees } = props;

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const currentMonthCutoff = moment().format('MMMM DD');

  const getMonthCutOff = () => {
    const currentMonth = moment().format('MMMM');
    const monthDay = Number(currentMonthCutoff.split(' ')[1]);

    console.log(moment().daysInMonth());

    if (monthDay < 15) {
      return currentMonth + '1-15 (1st cut-off)';
    }

    return currentMonth + '16-30 (2nd cut-off)';
  };

  const handleFormSubmit = async (formValues) => {
    await formFns.formSubmitFn(formValues);
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <Form.Group className="form-group">
        <FloatingLabel label="Employee">
          <Form.Select
            className={
              Boolean(errors && errors.employee_id?.type === 'required')
                ? 'border border-danger'
                : ''
            }
            defaultValue={values?.employee_id}
            {...register('employee_id', { required: true })}
            readOnly={Boolean(values)}
            disabled={Boolean(values)}
            placeholder="Employee"
          >
            <option value="">Choose</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>
      </Form.Group>

      <Form.Group className="form-group">
        <FloatingLabel label="Payroll/Payslip for Date">
          <Form.Control
            type="text"
            className={
              Boolean(errors && errors.payslip_for_date?.type === 'required')
                ? 'border border-danger'
                : ''
            }
            {...register('payslip_for_date', { required: true })}
            defaultValue={getMonthCutOff()}
            readOnly
            placeholder="Payroll/Payslip for Date"
          />
        </FloatingLabel>
      </Form.Group>

      <Form.Group className="form-group">
        <FloatingLabel label="Salary Amount per day in (₱) Pesos">
          <Form.Control
            type="number"
            defaultValue={Number(570).toFixed(2)}
            readOnly
            placeholder="Salary Amount per day"
          />
        </FloatingLabel>
      </Form.Group>

      <Form.Group className="form-group">
        <FloatingLabel label="Cut-off Salary Amount in (₱) Pesos">
          <Form.Control
            type="number"
            {...register('salary_amount', { required: true })}
            defaultValue={Number(8550).toFixed(2)}
            readOnly
            placeholder="Salary Amount per cut-off"
          />
        </FloatingLabel>

        <small className="text-muted">Fixed rate per working days</small>
      </Form.Group>

      <Form.Group className="form-group">
        <FloatingLabel label="Remarks">
          <Form.Control
            type="text0"
            className={
              Boolean(errors && errors.additional_details?.type === 'required')
                ? 'border border-danger'
                : ''
            }
            {...register('additional_details', { required: true })}
            style={{ height: '130px' }}
            as="textarea"
            defaultValue={values?.additional_details}
            readOnly={Boolean(values)}
            placeholder="Additional Details"
          />
        </FloatingLabel>
      </Form.Group>

      {Boolean(!values) && <Button type="submit">SUBMIT EMPLOYEE PAYSLIP</Button>}
    </Form>
  );
};

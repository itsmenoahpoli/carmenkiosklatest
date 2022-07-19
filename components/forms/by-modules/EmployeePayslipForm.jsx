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
  const DAILY_FIXED_RATE = Number(570).toFixed(2);
  const MONTHLY_FIXED_RATE = Number(8550).toFixed(2);

  const [noOfAbsents, setNoOfAbsents] = React.useState(0);
  const [computedSalary, setComputedSalaryAmount] = React.useState(MONTHLY_FIXED_RATE);

  const getMonthCutOff = () => {
    const currentMonth = moment().format('MMMM');
    const monthDay = Number(currentMonthCutoff.split(' ')[1]);

    if (monthDay < 15) {
      return currentMonth + '1-15 (1st cut-off)';
    }

    return currentMonth + '16-30 (2nd cut-off)';
  };

  const handleAbsentChange = (absents) => {
    let cutoffDeduction = DAILY_FIXED_RATE * parseInt(absents);
    let computedSalary = parseInt(MONTHLY_FIXED_RATE) - cutoffDeduction;

    if (absents === 0) return;

    setNoOfAbsents(absents);
    setComputedSalaryAmount(computedSalary.toFixed(2));
  };

  const handleFormSubmit = async (formValues) => {
    formValues.salary_amount = Number(computedSalary).toFixed(2);
    await formFns.formSubmitFn(formValues);

    setComputedSalaryAmount(MONTHLY_FIXED_RATE);
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
            {employees
              .filter((x) => x.status !== 0)
              .map((employee) => (
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
            defaultValue={DAILY_FIXED_RATE}
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
            value={computedSalary}
            readOnly
            placeholder="Salary Amount per cut-off"
          />
        </FloatingLabel>

        <small className="text-muted">Fixed rate per working days</small>
      </Form.Group>

      <Form.Group className="form-group">
        <FloatingLabel label="Total number of days absent">
          <Form.Control
            type="number"
            defaultValue={0}
            placeholder="No. of days absent for deduction"
            min="0"
            onChange={(e) => handleAbsentChange(e.target.value)}
          />
        </FloatingLabel>

        <small className="text-muted">No. of days absent</small>
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
            {...register('additional_details')}
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

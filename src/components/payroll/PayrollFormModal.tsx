"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormWrapper } from "@/components/ui/FormWrapper";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ApiError, payrollApi } from "@/lib/api";
import type { Employee } from "@/types/employee";
import { PAYMENT_STATUS_OPTIONS, type Payroll } from "@/types/payroll";

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2000, i, 1).toLocaleString("en-US", { month: "long" }),
}));

export interface PayrollFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (payroll: Payroll) => void;
  payroll?: Payroll | null;
  employees: Employee[];
}

export function PayrollFormModal({ isOpen, onClose, onSaved, payroll, employees }: PayrollFormModalProps) {
  const isEditing = Boolean(payroll);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Payroll Record" : "Add Payroll Record"}
      description={
        isEditing
          ? "Update salary breakdown or payment status."
          : "Create a payroll record for an employee's pay period."
      }
    >
      {/* Keyed by target record so the form remounts (and useState re-seeds from
          props) whenever a different payroll record is opened, instead of syncing
          field state via an effect. */}
      <PayrollForm
        key={payroll?.id ?? "new"}
        payroll={payroll}
        employees={employees}
        onSaved={onSaved}
        onClose={onClose}
      />
    </Modal>
  );
}

function PayrollForm({
  payroll,
  employees,
  onSaved,
  onClose,
}: {
  payroll?: Payroll | null;
  employees: Employee[];
  onSaved: (payroll: Payroll) => void;
  onClose: () => void;
}) {
  const isEditing = Boolean(payroll);
  const currentYear = new Date().getFullYear();

  const [employeeId, setEmployeeId] = useState(
    payroll ? String(payroll.employee_id) : String(employees[0]?.id ?? "")
  );
  const [month, setMonth] = useState(payroll ? String(payroll.month) : String(new Date().getMonth() + 1));
  const [year, setYear] = useState(payroll ? String(payroll.year) : String(currentYear));
  const [basicSalary, setBasicSalary] = useState(payroll?.basic_salary ?? "");
  const [allowances, setAllowances] = useState(payroll?.allowances ?? "0");
  const [deductions, setDeductions] = useState(payroll?.deductions ?? "0");
  const [paymentStatus, setPaymentStatus] = useState<Payroll["payment_status"]>(
    payroll?.payment_status ?? "PENDING"
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!employeeId) {
      setError("Please select an employee.");
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = isEditing
        ? await payrollApi.update(payroll!.id, {
            basic_salary: Number(basicSalary),
            allowances: Number(allowances),
            deductions: Number(deductions),
            payment_status: paymentStatus,
          })
        : await payrollApi.create({
            employee_id: Number(employeeId),
            month: Number(month),
            year: Number(year),
            basic_salary: Number(basicSalary),
            allowances: Number(allowances),
            deductions: Number(deductions),
            payment_status: paymentStatus,
          });
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save payroll record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper
      onSubmit={handleSubmit}
      error={error}
      onCancel={onClose}
      isSubmitting={isSubmitting}
      submitLabel={isEditing ? "Save changes" : "Create record"}
    >
      <Select
        label="Employee"
        required
        value={employeeId}
        onChange={(event) => setEmployeeId(event.target.value)}
        options={employees.map((e) => ({
          value: e.id,
          label: `${e.first_name} ${e.last_name} (${e.employee_code})`,
        }))}
        placeholder="Select an employee"
        disabled={isEditing}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Month"
          required
          value={month}
          onChange={(event) => setMonth(event.target.value)}
          options={MONTH_OPTIONS}
          disabled={isEditing}
        />
        <Input
          label="Year"
          type="number"
          required
          value={year}
          onChange={(event) => setYear(event.target.value)}
          disabled={isEditing}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Basic Salary"
          type="number"
          min="0"
          step="0.01"
          required
          value={basicSalary}
          onChange={(event) => setBasicSalary(event.target.value)}
        />
        <Input
          label="Allowances"
          type="number"
          min="0"
          step="0.01"
          value={allowances}
          onChange={(event) => setAllowances(event.target.value)}
        />
        <Input
          label="Deductions"
          type="number"
          min="0"
          step="0.01"
          value={deductions}
          onChange={(event) => setDeductions(event.target.value)}
        />
      </div>
      <Select
        label="Payment Status"
        required
        value={paymentStatus}
        onChange={(event) => setPaymentStatus(event.target.value as Payroll["payment_status"])}
        options={PAYMENT_STATUS_OPTIONS}
      />
    </FormWrapper>
  );
}

"use client";

import { useMemo, useState } from "react";
import { FormWrapper } from "@/components/ui/FormWrapper";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ApiError, employeesApi } from "@/lib/api";
import type { Department } from "@/types/department";
import type { Position } from "@/types/position";
import {
  EMPLOYEE_STATUS_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  type Employee,
} from "@/types/employee";

export interface EmployeeFormProps {
  departments: Department[];
  positions: Position[];
  employee?: Employee | null;
  onSaved: (employee: Employee) => void;
}

export function EmployeeForm({ departments, positions, employee, onSaved }: EmployeeFormProps) {
  const isEditing = Boolean(employee);

  const [employeeCode, setEmployeeCode] = useState(employee?.employee_code ?? "");
  const [firstName, setFirstName] = useState(employee?.first_name ?? "");
  const [lastName, setLastName] = useState(employee?.last_name ?? "");
  const [email, setEmail] = useState(employee?.email ?? "");
  const [phone, setPhone] = useState(employee?.phone ?? "");
  const [address, setAddress] = useState(employee?.address ?? "");
  const [departmentId, setDepartmentId] = useState(
    employee ? String(employee.department_id) : ""
  );
  const [positionId, setPositionId] = useState(employee ? String(employee.position_id) : "");
  const [joiningDate, setJoiningDate] = useState(employee?.joining_date ?? "");
  const [employmentType, setEmploymentType] = useState(employee?.employment_type ?? "FULL_TIME");
  const [basicSalary, setBasicSalary] = useState(employee?.basic_salary ?? "");
  const [status, setStatus] = useState(employee?.status ?? "ONBOARDING");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset the selected position when the department changes, so a position from
  // the previously selected department can never be submitted. Adjusted directly
  // during render (React's recommended pattern for this) rather than in an
  // effect, since it's purely derived from this component's own prior state.
  const [prevDepartmentId, setPrevDepartmentId] = useState(departmentId);
  if (departmentId !== prevDepartmentId) {
    setPrevDepartmentId(departmentId);
    setPositionId("");
  }

  const filteredPositions = useMemo(
    () => positions.filter((p) => String(p.department_id) === departmentId),
    [positions, departmentId]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!departmentId || !positionId) {
      setError("Please select a department and position.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        employee_code: employeeCode,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        address: address || null,
        department_id: Number(departmentId),
        position_id: Number(positionId),
        joining_date: joiningDate,
        employment_type: employmentType as Employee["employment_type"],
        basic_salary: Number(basicSalary),
        status: status as Employee["status"],
      };

      const saved = isEditing
        ? await employeesApi.update(employee!.id, payload)
        : await employeesApi.create(payload);
      onSaved(saved);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save employee.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper
      onSubmit={handleSubmit}
      error={error}
      isSubmitting={isSubmitting}
      submitLabel={isEditing ? "Save changes" : "Create employee"}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Employee Code"
          required
          value={employeeCode}
          onChange={(event) => setEmployeeCode(event.target.value)}
          placeholder="e.g. EMP001"
        />
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="employee@company.com"
        />
        <Input
          label="First Name"
          required
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <Input
          label="Last Name"
          required
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
        <Input
          label="Phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="e.g. 0771234567"
        />
        <Input
          label="Joining Date"
          type="date"
          required
          value={joiningDate}
          onChange={(event) => setJoiningDate(event.target.value)}
        />
        <Select
          label="Department"
          required
          value={departmentId}
          onChange={(event) => setDepartmentId(event.target.value)}
          options={departments.map((d) => ({ value: d.id, label: d.name }))}
          placeholder="Select a department"
        />
        <Select
          label="Position"
          required
          value={positionId}
          onChange={(event) => setPositionId(event.target.value)}
          options={filteredPositions.map((p) => ({ value: p.id, label: p.title }))}
          placeholder={departmentId ? "Select a position" : "Select a department first"}
          disabled={!departmentId}
        />
        <Select
          label="Employment Type"
          required
          value={employmentType}
          onChange={(event) => setEmploymentType(event.target.value as Employee["employment_type"])}
          options={EMPLOYMENT_TYPE_OPTIONS}
        />
        <Input
          label="Basic Salary"
          type="number"
          min="0"
          step="0.01"
          required
          value={basicSalary}
          onChange={(event) => setBasicSalary(event.target.value)}
          placeholder="0.00"
        />
        <Select
          label="Status"
          required
          value={status}
          onChange={(event) => setStatus(event.target.value as Employee["status"])}
          options={EMPLOYEE_STATUS_OPTIONS}
        />
      </div>
      <Textarea
        label="Address"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        placeholder="Residential address"
      />
    </FormWrapper>
  );
}

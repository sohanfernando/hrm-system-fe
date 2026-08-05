"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Table, TableColumn } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Alert } from "@/components/ui/Alert";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/components/providers/AuthProvider";
import { ApiError, departmentsApi, employeesApi } from "@/lib/api";
import type { Department } from "@/types/department";
import { EMPLOYEE_STATUS_OPTIONS, type Employee, type EmployeeStatus } from "@/types/employee";

const PAGE_SIZE = 10;

export default function EmployeesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    departmentsApi.list({ limit: 100 }).then((data) => setDepartments(data.items)).catch(() => {});
  }, []);

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await employeesApi.list({
        skip: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        department_id: departmentFilter ? Number(departmentFilter) : undefined,
        status: statusFilter || undefined,
      });
      setEmployees(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load employees.");
    } finally {
      setIsLoading(false);
    }
  }, [page, departmentFilter, statusFilter]);

  // Fetch on mount / filter change — synchronizing with the server.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEmployees();
  }, [loadEmployees]);

  const departmentName = (id: number) => departments.find((d) => d.id === id)?.name ?? `#${id}`;

  const handleDelete = async () => {
    if (!deletingEmployee) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await employeesApi.remove(deletingEmployee.id);
      setDeletingEmployee(null);
      loadEmployees();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Failed to delete employee.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: TableColumn<Employee>[] = [
    {
      key: "name",
      header: "Employee",
      render: (row) => (
        <div>
          <p className="font-medium">{row.first_name} {row.last_name}</p>
          <p className="text-caption text-muted">{row.employee_code} · {row.email}</p>
        </div>
      ),
    },
    { key: "department", header: "Department", render: (row) => departmentName(row.department_id) },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "joining_date", header: "Joined", render: (row) => row.joining_date },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2" onClick={(event) => event.stopPropagation()}>
          <Button size="sm" variant="outline" onClick={() => router.push(`/employees/${row.id}`)}>
            View
          </Button>
          {isAdmin && (
            <Button size="sm" variant="danger" onClick={() => setDeletingEmployee(row)}>
              <Trash2 size={14} />
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Employees"
          description="Onboard and manage your employees"
          action={
            <Link href="/employees/new">
              <Button>Onboard Employee</Button>
            </Link>
          }
        />

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="flex flex-col gap-3 sm:flex-row sm:max-w-lg">
          <Select
            value={departmentFilter}
            onChange={(event) => {
              setDepartmentFilter(event.target.value);
              setPage(1);
            }}
            options={[
              { value: "", label: "All departments" },
              ...departments.map((d) => ({ value: d.id, label: d.name })),
            ]}
          />
          <Select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as EmployeeStatus | "");
              setPage(1);
            }}
            options={[{ value: "", label: "All statuses" }, ...EMPLOYEE_STATUS_OPTIONS]}
          />
        </div>

        <Card className="p-0">
          <Table
            columns={columns}
            data={employees}
            keyExtractor={(row) => row.id}
            isLoading={isLoading}
            emptyTitle="No employees yet"
            emptyDescription="Onboard your first employee to get started."
            onRowClick={(row) => router.push(`/employees/${row.id}`)}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
        </Card>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deletingEmployee)}
        title="Delete Employee"
        description={`Are you sure you want to delete "${deletingEmployee?.first_name} ${deletingEmployee?.last_name}"? Their documents and payroll records will also be deleted. This cannot be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeletingEmployee(null);
          setDeleteError(null);
        }}
      />
    </DashboardLayout>
  );
}

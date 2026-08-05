"use client";

import { useCallback, useEffect, useState } from "react";
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
import { PayrollFormModal } from "@/components/payroll/PayrollFormModal";
import { useAuth } from "@/components/providers/AuthProvider";
import { ApiError, employeesApi, payrollApi } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Employee } from "@/types/employee";
import { PAYMENT_STATUS_OPTIONS, type PaymentStatus, type Payroll } from "@/types/payroll";

const PAGE_SIZE = 10;
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function PayrollPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<Payroll | null>(null);
  const [deletingPayroll, setDeletingPayroll] = useState<Payroll | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    employeesApi.list({ limit: 100 }).then((data) => setEmployees(data.items)).catch(() => {});
  }, []);

  const loadPayrolls = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await payrollApi.list({
        skip: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        employee_id: employeeFilter ? Number(employeeFilter) : undefined,
        payment_status: statusFilter || undefined,
      });
      setPayrolls(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load payroll records.");
    } finally {
      setIsLoading(false);
    }
  }, [page, employeeFilter, statusFilter]);

  // Fetch on mount / filter change — synchronizing with the server.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPayrolls();
  }, [loadPayrolls]);

  const employeeLabel = (id: number) => {
    const employee = employees.find((e) => e.id === id);
    return employee ? `${employee.first_name} ${employee.last_name}` : `#${id}`;
  };

  const handleDelete = async () => {
    if (!deletingPayroll) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await payrollApi.remove(deletingPayroll.id);
      setDeletingPayroll(null);
      loadPayrolls();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Failed to delete payroll record.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: TableColumn<Payroll>[] = [
    {
      key: "employee",
      header: "Employee",
      render: (row) => <span className="font-medium">{employeeLabel(row.employee_id)}</span>,
    },
    {
      key: "period",
      header: "Period",
      render: (row) => `${MONTH_NAMES[row.month - 1]} ${row.year}`,
    },
    { key: "basic_salary", header: "Basic", render: (row) => formatCurrency(row.basic_salary) },
    { key: "allowances", header: "Allowances", render: (row) => formatCurrency(row.allowances) },
    { key: "deductions", header: "Deductions", render: (row) => formatCurrency(row.deductions) },
    {
      key: "net_salary",
      header: "Net Salary",
      render: (row) => <span className="font-medium">{formatCurrency(row.net_salary)}</span>,
    },
    {
      key: "payment_status",
      header: "Status",
      render: (row) => <StatusBadge status={row.payment_status} />,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingPayroll(row);
              setIsFormOpen(true);
            }}
          >
            Edit
          </Button>
          {isAdmin && (
            <Button size="sm" variant="danger" onClick={() => setDeletingPayroll(row)}>
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
          title="Payroll"
          description="Manage monthly payroll records"
          action={
            <Button
              onClick={() => {
                setEditingPayroll(null);
                setIsFormOpen(true);
              }}
              disabled={employees.length === 0}
            >
              Add Payroll Record
            </Button>
          }
        />

        {error && <Alert variant="danger">{error}</Alert>}
        {deleteError && <Alert variant="danger">{deleteError}</Alert>}

        <div className="flex flex-col gap-3 sm:flex-row sm:max-w-lg">
          <Select
            value={employeeFilter}
            onChange={(event) => {
              setEmployeeFilter(event.target.value);
              setPage(1);
            }}
            options={[
              { value: "", label: "All employees" },
              ...employees.map((e) => ({ value: e.id, label: `${e.first_name} ${e.last_name}` })),
            ]}
          />
          <Select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as PaymentStatus | "");
              setPage(1);
            }}
            options={[{ value: "", label: "All statuses" }, ...PAYMENT_STATUS_OPTIONS]}
          />
        </div>

        <Card className="p-0">
          <Table
            columns={columns}
            data={payrolls}
            keyExtractor={(row) => row.id}
            isLoading={isLoading}
            emptyTitle="No payroll records yet"
            emptyDescription="Add a payroll record to get started."
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
        </Card>
      </div>

      <PayrollFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={loadPayrolls}
        payroll={editingPayroll}
        employees={employees}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingPayroll)}
        title="Delete Payroll Record"
        description="Are you sure you want to delete this payroll record? This cannot be undone."
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingPayroll(null)}
      />
    </DashboardLayout>
  );
}

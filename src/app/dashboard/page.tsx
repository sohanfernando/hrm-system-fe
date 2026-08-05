"use client";

import { useEffect, useState } from "react";
import { Briefcase, Building2, Users, Wallet } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { Table, TableColumn } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Alert } from "@/components/ui/Alert";
import { dashboardApi, departmentsApi, employeesApi, ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { DashboardSummary } from "@/types/dashboard";
import type { Employee } from "@/types/employee";
import type { Payroll } from "@/types/payroll";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [departmentNames, setDepartmentNames] = useState<Record<number, string>>({});
  const [employeeNames, setEmployeeNames] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [summaryData, departmentsData, employeesData] = await Promise.all([
          dashboardApi.summary(),
          departmentsApi.list({ limit: 100 }),
          employeesApi.list({ limit: 100 }),
        ]);
        if (!isMounted) return;

        setSummary(summaryData);
        setDepartmentNames(
          Object.fromEntries(departmentsData.items.map((d) => [d.id, d.name]))
        );
        setEmployeeNames(
          Object.fromEntries(
            employeesData.items.map((e: Employee) => [e.id, `${e.first_name} ${e.last_name}`])
          )
        );
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof ApiError ? err.message : "Failed to load dashboard data.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const employeeColumns: TableColumn<Employee>[] = [
    {
      key: "name",
      header: "Employee",
      render: (row) => (
        <div>
          <p className="font-medium">{row.first_name} {row.last_name}</p>
          <p className="text-caption text-muted">{row.employee_code}</p>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      render: (row) => departmentNames[row.department_id] ?? `#${row.department_id}`,
    },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "joining_date", header: "Joined", render: (row) => row.joining_date },
  ];

  const payrollColumns: TableColumn<Payroll>[] = [
    {
      key: "employee",
      header: "Employee",
      render: (row) => employeeNames[row.employee_id] ?? `#${row.employee_id}`,
    },
    {
      key: "period",
      header: "Period",
      render: (row) => `${MONTH_NAMES[row.month - 1]} ${row.year}`,
    },
    { key: "net_salary", header: "Net Salary", render: (row) => formatCurrency(row.net_salary) },
    {
      key: "payment_status",
      header: "Status",
      render: (row) => <StatusBadge status={row.payment_status} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Employees"
            value={isLoading ? "—" : String(summary?.total_employees ?? 0)}
            icon={Users}
            tone="primary"
          />
          <StatCard
            label="Total Departments"
            value={isLoading ? "—" : String(summary?.total_departments ?? 0)}
            icon={Building2}
            tone="secondary"
          />
          <StatCard
            label="Total Positions"
            value={isLoading ? "—" : String(summary?.total_positions ?? 0)}
            icon={Briefcase}
            tone="warning"
          />
          <StatCard
            label="Monthly Payroll Total"
            value={isLoading ? "—" : formatCurrency(summary?.monthly_payroll_total ?? "0")}
            icon={Wallet}
            tone="success"
          />
        </div>

        <Card title="Recent Employees" description="Latest employees added to the system">
          <Table
            columns={employeeColumns}
            data={summary?.recent_employees ?? []}
            keyExtractor={(row) => row.id}
            isLoading={isLoading}
            emptyTitle="No employees yet"
            emptyDescription="Onboard your first employee to see them here."
          />
        </Card>

        <Card title="Pending Payrolls" description="Payroll records awaiting payment">
          <Table
            columns={payrollColumns}
            data={summary?.pending_payrolls ?? []}
            keyExtractor={(row) => row.id}
            isLoading={isLoading}
            emptyTitle="No pending payrolls"
            emptyDescription="All payroll records are settled."
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}

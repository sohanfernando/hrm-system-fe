"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { EmployeeDocumentsSection } from "@/components/employees/EmployeeDocumentsSection";
import { useAuth } from "@/components/providers/AuthProvider";
import { ApiError, departmentsApi, employeesApi, positionsApi } from "@/lib/api";
import type { Department } from "@/types/department";
import type { Position } from "@/types/position";
import type { Employee } from "@/types/employee";

export default function EmployeeDetailPage() {
  const params = useParams<{ id: string }>();
  const employeeId = Number(params.id);
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [employeeData, departmentsData, positionsData] = await Promise.all([
          employeesApi.get(employeeId),
          departmentsApi.list({ limit: 100 }),
          positionsApi.list({ limit: 100 }),
        ]);
        setEmployee(employeeData);
        setDepartments(departmentsData.items);
        setPositions(positionsData.items);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load employee.");
      } finally {
        setIsLoading(false);
      }
    }
    if (!Number.isNaN(employeeId)) load();
  }, [employeeId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await employeesApi.remove(employeeId);
      router.push("/employees");
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Failed to delete employee.");
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={employee ? `${employee.first_name} ${employee.last_name}` : "Employee"}
          description={employee?.employee_code}
          action={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/employees")}>
                Back to list
              </Button>
              {isAdmin && (
                <Button variant="danger" onClick={() => setIsDeleteOpen(true)} disabled={!employee}>
                  Delete
                </Button>
              )}
            </div>
          }
        />

        {error && <Alert variant="danger">{error}</Alert>}
        {deleteError && <Alert variant="danger">{deleteError}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" className="text-primary" />
          </div>
        ) : employee ? (
          <>
            <Card title="Employee Details">
              <EmployeeForm
                departments={departments}
                positions={positions}
                employee={employee}
                onSaved={(updated) => {
                  setEmployee(updated);
                  setSuccessMessage("Employee details updated successfully.");
                }}
              />
            </Card>

            <Card title="Documents" description="Upload, view, download, or delete employee documents">
              <EmployeeDocumentsSection employeeId={employee.id} />
            </Card>
          </>
        ) : (
          !error && <p className="text-body text-muted">Employee not found.</p>
        )}
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Employee"
        description={`Are you sure you want to delete "${employee?.first_name} ${employee?.last_name}"? Their documents and payroll records will also be deleted. This cannot be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </DashboardLayout>
  );
}

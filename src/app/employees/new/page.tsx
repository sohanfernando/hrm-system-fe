"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { EmployeeDocumentsSection } from "@/components/employees/EmployeeDocumentsSection";
import { departmentsApi, positionsApi } from "@/lib/api";
import type { Department } from "@/types/department";
import type { Position } from "@/types/position";
import type { Employee } from "@/types/employee";

export default function OnboardEmployeePage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [createdEmployee, setCreatedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    Promise.all([departmentsApi.list({ limit: 100 }), positionsApi.list({ limit: 100 })]).then(
      ([departmentsData, positionsData]) => {
        setDepartments(departmentsData.items);
        setPositions(positionsData.items);
      }
    );
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Employee Onboarding"
          description="Add a new employee and upload their onboarding documents"
        />

        <Card title="Employee Details" description="Step 1 — enter the employee's core information">
          {createdEmployee ? (
            <Alert variant="success">
              {createdEmployee.first_name} {createdEmployee.last_name} was created successfully. You can
              now upload their documents below, or{" "}
              <button
                className="font-medium underline"
                onClick={() => router.push(`/employees/${createdEmployee.id}`)}
              >
                go to their profile
              </button>
              .
            </Alert>
          ) : (
            <EmployeeForm
              departments={departments}
              positions={positions}
              onSaved={(employee) => setCreatedEmployee(employee)}
            />
          )}
        </Card>

        <Card
          title="Document Upload"
          description={
            createdEmployee
              ? "Step 2 — upload NIC/ID, CV, certificates, or other supporting documents"
              : "Complete step 1 to unlock document upload"
          }
        >
          {createdEmployee ? (
            <EmployeeDocumentsSection employeeId={createdEmployee.id} />
          ) : (
            <p className="py-6 text-center text-body text-muted">
              Save the employee&apos;s details first to enable document upload.
            </p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}

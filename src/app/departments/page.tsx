"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Table, TableColumn } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Alert } from "@/components/ui/Alert";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DepartmentFormModal } from "@/components/departments/DepartmentFormModal";
import { useAuth } from "@/components/providers/AuthProvider";
import { ApiError, departmentsApi } from "@/lib/api";
import type { Department } from "@/types/department";

const PAGE_SIZE = 10;

export default function DepartmentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [departments, setDepartments] = useState<Department[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadDepartments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await departmentsApi.list({ skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE });
      setDepartments(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load departments.");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  // Fetch on mount / page change — synchronizing with the server.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDepartments();
  }, [loadDepartments]);

  const handleSaved = () => {
    loadDepartments();
  };

  const handleDelete = async () => {
    if (!deletingDepartment) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await departmentsApi.remove(deletingDepartment.id);
      setDeletingDepartment(null);
      loadDepartments();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Failed to delete department.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: TableColumn<Department>[] = [
    { key: "name", header: "Name", render: (row) => <span className="font-medium">{row.name}</span> },
    {
      key: "description",
      header: "Description",
      render: (row) => row.description || <span className="text-muted">—</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.is_active ? "ACTIVE" : "INACTIVE"} />,
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
              setEditingDepartment(row);
              setIsFormOpen(true);
            }}
          >
            Edit
          </Button>
          {isAdmin && (
            <Button size="sm" variant="danger" onClick={() => setDeletingDepartment(row)}>
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
          title="Departments"
          description="Manage your organization's departments"
          action={
            <Button
              onClick={() => {
                setEditingDepartment(null);
                setIsFormOpen(true);
              }}
            >
              Add Department
            </Button>
          }
        />

        {error && <Alert variant="danger">{error}</Alert>}
        {deleteError && <Alert variant="danger">{deleteError}</Alert>}

        <Card className="p-0">
          <Table
            columns={columns}
            data={departments}
            keyExtractor={(row) => row.id}
            isLoading={isLoading}
            emptyTitle="No departments yet"
            emptyDescription="Add your first department to get started."
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
        </Card>
      </div>

      <DepartmentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={handleSaved}
        department={editingDepartment}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingDepartment)}
        title="Delete Department"
        description={`Are you sure you want to delete "${deletingDepartment?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingDepartment(null)}
      />
    </DashboardLayout>
  );
}

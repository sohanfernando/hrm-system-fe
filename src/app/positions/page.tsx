"use client";

import { useCallback, useEffect, useState } from "react";
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
import { PositionFormModal } from "@/components/positions/PositionFormModal";
import { useAuth } from "@/components/providers/AuthProvider";
import { ApiError, departmentsApi, positionsApi } from "@/lib/api";
import type { Department } from "@/types/department";
import type { Position } from "@/types/position";

const PAGE_SIZE = 10;

export default function PositionsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [deletingPosition, setDeletingPosition] = useState<Position | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    departmentsApi.list({ limit: 100 }).then((data) => setDepartments(data.items)).catch(() => {});
  }, []);

  const loadPositions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await positionsApi.list({
        skip: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        department_id: departmentFilter ? Number(departmentFilter) : undefined,
      });
      setPositions(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load positions.");
    } finally {
      setIsLoading(false);
    }
  }, [page, departmentFilter]);

  // Fetch on mount / filter change — synchronizing with the server.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPositions();
  }, [loadPositions]);

  const departmentName = (id: number) => departments.find((d) => d.id === id)?.name ?? `#${id}`;

  const handleDelete = async () => {
    if (!deletingPosition) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await positionsApi.remove(deletingPosition.id);
      setDeletingPosition(null);
      loadPositions();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Failed to delete position.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: TableColumn<Position>[] = [
    { key: "title", header: "Title", render: (row) => <span className="font-medium">{row.title}</span> },
    { key: "department", header: "Department", render: (row) => departmentName(row.department_id) },
    {
      key: "description",
      header: "Description",
      className: "max-w-md break-words",
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
              setEditingPosition(row);
              setIsFormOpen(true);
            }}
          >
            Edit
          </Button>
          {isAdmin && (
            <Button size="sm" variant="danger" onClick={() => setDeletingPosition(row)}>
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
          title="Positions"
          description="Manage job positions within departments"
          action={
            <Button
              onClick={() => {
                setEditingPosition(null);
                setIsFormOpen(true);
              }}
              disabled={departments.length === 0}
            >
              Add Position
            </Button>
          }
        />

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="max-w-xs">
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
        </div>

        <Card className="p-0">
          <Table
            columns={columns}
            data={positions}
            keyExtractor={(row) => row.id}
            isLoading={isLoading}
            emptyTitle="No positions yet"
            emptyDescription="Add your first position to get started."
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
        </Card>
      </div>

      <PositionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={loadPositions}
        position={editingPosition}
        departments={departments}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingPosition)}
        title="Delete Position"
        description={`Are you sure you want to delete "${deletingPosition?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeletingPosition(null);
          setDeleteError(null);
        }}
      />
    </DashboardLayout>
  );
}

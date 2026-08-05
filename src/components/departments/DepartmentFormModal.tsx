"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormWrapper } from "@/components/ui/FormWrapper";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ApiError, departmentsApi } from "@/lib/api";
import type { Department } from "@/types/department";

export interface DepartmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (department: Department) => void;
  department?: Department | null;
}

export function DepartmentFormModal({ isOpen, onClose, onSaved, department }: DepartmentFormModalProps) {
  const isEditing = Boolean(department);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Department" : "Add Department"}
      description={isEditing ? "Update department details." : "Create a new department."}
    >
      {/* Keyed by target record so the form remounts (and useState re-seeds from
          props) whenever a different department is opened, instead of syncing
          field state via an effect. */}
      <DepartmentForm key={department?.id ?? "new"} department={department} onSaved={onSaved} onClose={onClose} />
    </Modal>
  );
}

function DepartmentForm({
  department,
  onSaved,
  onClose,
}: {
  department?: Department | null;
  onSaved: (department: Department) => void;
  onClose: () => void;
}) {
  const isEditing = Boolean(department);

  const [name, setName] = useState(department?.name ?? "");
  const [description, setDescription] = useState(department?.description ?? "");
  const [isActive, setIsActive] = useState(department?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = { name, description: description || null, is_active: isActive };
      const saved = isEditing
        ? await departmentsApi.update(department!.id, payload)
        : await departmentsApi.create(payload);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save department.");
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
      submitLabel={isEditing ? "Save changes" : "Create department"}
    >
      <Input
        label="Name"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="e.g. Engineering"
      />
      <Textarea
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Brief description of this department"
      />
      <label className="flex items-center gap-2 text-body text-foreground">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
          className="focus-ring h-4 w-4 rounded border-border text-primary"
        />
        Active
      </label>
    </FormWrapper>
  );
}

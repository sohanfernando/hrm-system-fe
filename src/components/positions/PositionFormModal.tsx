"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormWrapper } from "@/components/ui/FormWrapper";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ApiError, positionsApi } from "@/lib/api";
import type { Department } from "@/types/department";
import type { Position } from "@/types/position";

export interface PositionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (position: Position) => void;
  position?: Position | null;
  departments: Department[];
}

export function PositionFormModal({
  isOpen,
  onClose,
  onSaved,
  position,
  departments,
}: PositionFormModalProps) {
  const isEditing = Boolean(position);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Position" : "Add Position"}
      description={isEditing ? "Update position details." : "Create a new position."}
    >
      {/* Keyed by target record so the form remounts (and useState re-seeds from
          props) whenever a different position is opened, instead of syncing
          field state via an effect. */}
      <PositionForm
        key={position?.id ?? "new"}
        position={position}
        departments={departments}
        onSaved={onSaved}
        onClose={onClose}
      />
    </Modal>
  );
}

function PositionForm({
  position,
  departments,
  onSaved,
  onClose,
}: {
  position?: Position | null;
  departments: Department[];
  onSaved: (position: Position) => void;
  onClose: () => void;
}) {
  const isEditing = Boolean(position);

  const [departmentId, setDepartmentId] = useState(
    position ? String(position.department_id) : String(departments[0]?.id ?? "")
  );
  const [title, setTitle] = useState(position?.title ?? "");
  const [description, setDescription] = useState(position?.description ?? "");
  const [isActive, setIsActive] = useState(position?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!departmentId) {
      setError("Please select a department.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        department_id: Number(departmentId),
        title,
        description: description || null,
        is_active: isActive,
      };
      const saved = isEditing
        ? await positionsApi.update(position!.id, payload)
        : await positionsApi.create(payload);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save position.");
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
      submitLabel={isEditing ? "Save changes" : "Create position"}
    >
      <Select
        label="Department"
        required
        value={departmentId}
        onChange={(event) => setDepartmentId(event.target.value)}
        options={departments.map((d) => ({ value: d.id, label: d.name }))}
        placeholder="Select a department"
      />
      <Input
        label="Title"
        required
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="e.g. Backend Developer Intern"
      />
      <Textarea
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Brief description of this role"
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

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth/context/UseAuth";
import {
  useGetDepartmentsByOrganizationQuery,
  type Department,
} from "@/features/organization/api/useGetDepartmentsByOrganizationQuery";
import { useCreateDepartmentMutation } from "@/features/organization/api/useCreateDepartmentMutation";
import { useUpdateDepartmentMutation } from "@/features/organization/api/useUpdateDepartmentMutation";
import { useDeleteDepartmentMutation } from "@/features/organization/api/useDeleteDepartmentMutation";

export default function DepartmentManagementPage() {
  const { organizationId } = useAuth();
  const { toast } = useToast();

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form states
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentDescription, setNewDepartmentDescription] = useState("");
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(
    null
  );

  // Queries and mutations
  const { data, loading: departmentsLoading } = useGetDepartmentsByOrganizationQuery(
    organizationId
  );
  
  const departments = data?.getDepartmentsByOrganization ?? [];

  const [createDept, { loading: creating }] = useCreateDepartmentMutation();
  const [updateDept, { loading: updating }] = useUpdateDepartmentMutation();
  const [deleteDept, { loading: deleting }] = useDeleteDepartmentMutation();

  // Handlers for create
  const handleCreateDepartment = async () => {
    if (!newDepartmentName.trim() || !organizationId) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await createDept({
        variables: {
          input: {
            name: newDepartmentName.trim(),
            description: newDepartmentDescription.trim() || null,
            organizationId,
          },
        },
      });

      setNewDepartmentName("");
      setNewDepartmentDescription("");
      setCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Department created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.message || "Failed to create department",
        variant: "destructive",
      });
    }
  };

  // Handlers for edit
  const handleEditDepartment = async () => {
    if (!editingDepartment || !editingDepartment.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateDept({
        variables: {
          input: {
            id: editingDepartment.id,
            name: editingDepartment.name.trim(),
            description: editingDepartment.description
              ? editingDepartment.description.trim()
              : null,
          },
        },
      });

      setEditingDepartment(null);
      setEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Department updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.message || "Failed to update department",
        variant: "destructive",
      });
    }
  };

  // Handlers for delete
  const handleDeleteDepartment = async () => {
    if (!departmentToDelete) return;

    try {
      await deleteDept({
        variables: {
          input: {
            id: departmentToDelete.id,
            organizationId: departmentToDelete.organizationId,
          },
        },
      });

      setDepartmentToDelete(null);
      setDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.message || "Failed to delete department",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (dept: Department) => {
    setEditingDepartment({ ...dept });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (dept: Department) => {
    setDepartmentToDelete(dept);
    setDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (departmentsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading departments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Department Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage departments within your organization
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      {/* Main Content */}
      <Card className="overflow-hidden">
        {departments.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground">
                No departments yet. Create your first department to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee Count</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="w-[100px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow
                    key={dept?.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-semibold">{dept?.name}</TableCell>
                    <TableCell>{dept?.employeeCount}</TableCell>
                    <TableCell>{dept?.createdAt ? formatDate(dept.createdAt) : "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dept && openEditDialog(dept as Department)}
                          aria-label="Edit department"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dept && openDeleteDialog(dept as Department)}
                          aria-label="Delete department"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Create Department Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Department</DialogTitle>
            <DialogDescription>
              Add a new department to organize your team members
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dept-name">Department Name</Label>
              <Input
                id="dept-name"
                placeholder="e.g., Engineering, Marketing, Sales"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !creating &&
                    newDepartmentName.trim()
                  ) {
                    handleCreateDepartment();
                  }
                }}
                disabled={creating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dept-description">Description (Optional)</Label>
              <Textarea
                id="dept-description"
                placeholder="Brief description of this department"
                value={newDepartmentDescription}
                onChange={(e) => setNewDepartmentDescription(e.target.value)}
                disabled={creating}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                setNewDepartmentName("");
                setNewDepartmentDescription("");
              }}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateDepartment}
              disabled={creating || !newDepartmentName.trim()}
              className="gap-2"
            >
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              {creating ? "Creating..." : "Create Department"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update department details
            </DialogDescription>
          </DialogHeader>

          {editingDepartment && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-dept-name">Department Name</Label>
                <Input
                  id="edit-dept-name"
                  placeholder="Department name"
                  value={editingDepartment.name}
                  onChange={(e) =>
                    setEditingDepartment({
                      ...editingDepartment,
                      name: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !updating &&
                      editingDepartment.name.trim()
                    ) {
                      handleEditDepartment();
                    }
                  }}
                  disabled={updating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dept-description">
                  Description (Optional)
                </Label>
                <Textarea
                  id="edit-dept-description"
                  placeholder="Brief description of this department"
                  value={editingDepartment.description || ""}
                  onChange={(e) =>
                    setEditingDepartment({
                      ...editingDepartment,
                      description: e.target.value,
                    })
                  }
                  disabled={updating}
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setEditingDepartment(null);
              }}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditDepartment}
              disabled={updating || !editingDepartment?.name.trim()}
              className="gap-2"
            >
              {updating && <Loader2 className="h-4 w-4 animate-spin" />}
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Department?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Users in this department will be
              unassigned.
            </DialogDescription>
          </DialogHeader>
          <div className="my-2 rounded-md bg-destructive/10 p-3">
            <p className="text-sm font-medium text-destructive">
              {departmentToDelete?.name}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteDepartment}
              disabled={deleting}
              variant="destructive"
              className="gap-2"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

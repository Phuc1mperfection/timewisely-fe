import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoalProgressDashboard } from "@/components/goals/GoalProgressDashboard";
import { GoalManagementModal } from "@/components/goals/GoalManagementModal";
import { deleteGoal } from "@/services/goalServices";
import type { PersonalGoal } from "@/interfaces/Goal";

export default function GoalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingGoal, setEditingGoal] = useState<PersonalGoal | undefined>();

  const handleModalSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setIsModalOpen(false);
    setEditingGoal(undefined);
  };

  const handleEditGoal = (goal: PersonalGoal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) {
      return;
    }

    try {
      await deleteGoal(goalId);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to delete goal:", error);
      alert("Failed to delete goal. Please try again.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingGoal(undefined);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Goals</h1>
          <p className="text-muted-foreground mt-1">
            Set targets and track your progress
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </div>

      <GoalProgressDashboard
        key={refreshKey}
        onCreateGoal={() => setIsModalOpen(true)}
        onEditGoal={handleEditGoal}
        onDeleteGoal={handleDeleteGoal}
      />

      <GoalManagementModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        goal={editingGoal}
      />
    </div>
  );
}

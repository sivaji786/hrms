import React, { useState } from 'react';
import GoalsList from './GoalsList';
import CreateGoal from './CreateGoal';
import GoalDetails from './GoalDetails';
import KRAManagement from './KRAManagement';
import CreateKRA from './CreateKRA';
import KRADetails from './KRADetails';
import AssignGoal from './AssignGoal';
import { goals, kras } from '../../data/goalsData';

type GoalsView = 
  | 'list' 
  | 'create' 
  | 'edit' 
  | 'details' 
  | 'kra-management' 
  | 'kra-create' 
  | 'kra-edit' 
  | 'kra-details'
  | 'assign-goal';

interface GoalsState {
  view: GoalsView;
  selectedGoalId?: string;
  selectedKRAId?: string;
}

export default function Goals() {
  const [state, setState] = useState<GoalsState>({
    view: 'list',
  });

  const handleCreateGoal = () => {
    setState({ view: 'create' });
  };

  const handleViewGoal = (goalId: string) => {
    setState({ view: 'details', selectedGoalId: goalId });
  };

  const handleEditGoal = (goalId: string) => {
    setState({ view: 'edit', selectedGoalId: goalId });
  };

  const handleManageKRAs = () => {
    setState({ view: 'kra-management' });
  };

  const handleAssignGoal = () => {
    setState({ view: 'assign-goal' });
  };

  const handleBackToList = () => {
    setState({ view: 'list' });
  };

  const handleBackToKRAs = () => {
    setState({ view: 'kra-management' });
  };

  const handleCreateKRA = () => {
    setState({ view: 'kra-create' });
  };

  const handleViewKRA = (kraId: string) => {
    setState({ view: 'kra-details', selectedKRAId: kraId });
  };

  const handleEditKRA = (kraId: string) => {
    setState({ view: 'kra-edit', selectedKRAId: kraId });
  };

  // Render based on current view
  switch (state.view) {
    case 'create':
      return <CreateGoal onBack={handleBackToList} />;

    case 'edit':
      const goalToEdit = goals.find((g) => g.id === state.selectedGoalId);
      return <CreateGoal onBack={handleBackToList} goal={goalToEdit} />;

    case 'details':
      return (
        <GoalDetails
          goalId={state.selectedGoalId!}
          onBack={handleBackToList}
          onEdit={handleEditGoal}
        />
      );

    case 'assign-goal':
      return <AssignGoal onBack={handleBackToList} />;

    case 'kra-management':
      return (
        <KRAManagement
          onBack={handleBackToList}
          onCreateKRA={handleCreateKRA}
          onViewKRA={handleViewKRA}
        />
      );

    case 'kra-create':
      return <CreateKRA onBack={handleBackToKRAs} />;

    case 'kra-edit':
      const kraToEdit = kras.find((k) => k.id === state.selectedKRAId);
      return <CreateKRA onBack={handleBackToKRAs} kra={kraToEdit} />;

    case 'kra-details':
      return (
        <KRADetails
          kraId={state.selectedKRAId!}
          onBack={handleBackToKRAs}
          onEdit={handleEditKRA}
          onViewGoal={handleViewGoal}
        />
      );

    case 'list':
    default:
      return (
        <GoalsList
          onCreateGoal={handleCreateGoal}
          onViewGoal={handleViewGoal}
          onManageKRAs={handleManageKRAs}
          onAssignGoal={handleAssignGoal}
        />
      );
  }
}

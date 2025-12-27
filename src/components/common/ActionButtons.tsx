import { Button } from '../ui/button';
import { Eye, Edit, Trash2, Check, X, Download, Send } from 'lucide-react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function ViewButton({ onClick, disabled }: ActionButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={disabled}>
      <Eye className="w-4 h-4 mr-1" />
      View
    </Button>
  );
}

export function EditButton({ onClick, disabled }: ActionButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={disabled}>
      <Edit className="w-4 h-4 mr-1" />
      Edit
    </Button>
  );
}

export function DeleteButton({ onClick, disabled }: ActionButtonProps) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onClick} 
      disabled={disabled}
      className="text-red-600 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4 mr-1" />
      Delete
    </Button>
  );
}

export function ApproveButton({ onClick, disabled }: ActionButtonProps) {
  return (
    <Button 
      size="sm" 
      onClick={onClick} 
      disabled={disabled}
      className="bg-green-600 hover:bg-green-700"
    >
      <Check className="w-4 h-4 mr-1" />
      Approve
    </Button>
  );
}

export function RejectButton({ onClick, disabled }: ActionButtonProps) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onClick} 
      disabled={disabled}
      className="text-red-600 hover:bg-red-50"
    >
      <X className="w-4 h-4 mr-1" />
      Reject
    </Button>
  );
}

export function DownloadButton({ onClick, disabled }: ActionButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={disabled}>
      <Download className="w-4 h-4 mr-1" />
      Download
    </Button>
  );
}

export function SendButton({ onClick, disabled, label = 'Send' }: ActionButtonProps & { label?: string }) {
  return (
    <Button 
      size="sm" 
      onClick={onClick} 
      disabled={disabled}
      className="bg-gradient-to-r from-blue-600 to-indigo-600"
    >
      <Send className="w-4 h-4 mr-1" />
      {label}
    </Button>
  );
}

interface ActionButtonGroupProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onDownload?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  className?: string;
}

export function ActionButtonGroup({
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onDownload,
  className = 'flex gap-2',
}: ActionButtonGroupProps) {
  return (
    <div className={className}>
      {onView && <ViewButton onClick={onView} />}
      {onEdit && <EditButton onClick={onEdit} />}
      {onDelete && <DeleteButton onClick={onDelete} />}
      {onApprove && <ApproveButton onClick={onApprove} />}
      {onReject && <RejectButton onClick={onReject} />}
      {onDownload && <DownloadButton onClick={onDownload} />}
    </div>
  );
}

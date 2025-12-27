import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      icon: AlertCircle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      buttonClass: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      buttonClass: 'bg-orange-600 hover:bg-orange-700',
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      buttonClass: 'bg-blue-600 hover:bg-blue-700',
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      buttonClass: 'bg-green-600 hover:bg-green-700',
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md p-4 animate-in zoom-in-95 duration-200">
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${config.bgColor} ${config.borderColor} border`}>
                <Icon className={`w-6 h-6 ${config.iconColor}`} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">{title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 leading-relaxed">{message}</p>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="min-w-[100px]"
              >
                {cancelText}
              </Button>
              <Button
                onClick={handleConfirm}
                className={`min-w-[100px] text-white ${config.buttonClass}`}
              >
                {confirmText}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

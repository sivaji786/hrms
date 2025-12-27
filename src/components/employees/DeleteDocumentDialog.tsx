import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AlertCircle, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface DeleteDocumentDialogProps {
  document: {
    id: string;
    name: string;
  };
  onDelete: () => void;
  onBack: () => void;
}

export default function DeleteDocumentDialog({ 
  document, 
  onDelete, 
  onBack 
}: DeleteDocumentDialogProps) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={onBack}
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-900">{t('documents.deleteDocument')}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            {t('documents.deleteConfirmMessage', { name: document.name })}
          </p>
          <p className="text-sm text-gray-600">
            {t('documents.deleteWarning')}
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onBack} className="flex-1">
              {t('common.cancel')}
            </Button>
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={onDelete}
            >
              {t('documents.deleteConfirm')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
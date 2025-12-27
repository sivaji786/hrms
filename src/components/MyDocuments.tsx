import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { FileText, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function MyDocuments() {
  const { t } = useLanguage();

  const documents = [
    { name: 'Employment Contract', type: 'PDF', uploadedDate: '2022-01-15' },
    { name: 'ID Copy', type: 'PDF', uploadedDate: '2022-01-15' },
    { name: 'Certificates', type: 'PDF', uploadedDate: '2023-05-20' },
  ];

  return (
    <div className="space-y-6">


      <Card>
        <CardHeader>
          <CardTitle>{t('employee.documents')}</CardTitle>
          <CardDescription>{t('employee.uploadedDocuments')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.type} • {new Date(doc.uploadedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Ticket, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function MyTickets() {
  const { t } = useLanguage();

  const tickets = [
    { id: '#T-001', subject: 'Laptop Issue', priority: 'High', status: 'Open', date: '2025-11-15' },
    { id: '#T-002', subject: 'Leave Query', priority: 'Low', status: 'Resolved', date: '2025-11-10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <Plus className="w-4 h-4 mr-2" />
          {t('employee.createTicket')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('employee.tickets')}</CardTitle>
          <CardDescription>{t('employee.allTickets')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tickets.map((ticket, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Ticket className="w-4 h-4 text-blue-600" />
                    <p className="font-medium">{ticket.id}</p>
                    <Badge variant="outline" className="text-xs">{ticket.priority}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{ticket.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(ticket.date).toLocaleDateString()}</p>
                </div>
                <Badge variant="outline">{ticket.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

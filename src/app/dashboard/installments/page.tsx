import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Badge } from '@/components/ui/badge';
  
  const installments = [
    {
      id: 'PAR-001',
      client: 'João da Silva',
      value: 150.0,
      dueDate: '2024-07-30',
      status: 'Pago',
    },
    {
      id: 'PAR-002',
      client: 'Maria Oliveira',
      value: 200.5,
      dueDate: '2024-08-05',
      status: 'Pendente',
    },
    {
      id: 'PAR-003',
      client: 'Carlos Pereira',
      value: 75.25,
      dueDate: '2024-06-15',
      status: 'Não Pago',
    },
    {
      id: 'PAR-004',
      client: 'Ana Costa',
      value: 300.0,
      dueDate: '2024-08-10',
      status: 'Pendente',
    },
    {
      id: 'PAR-005',
      client: 'Pedro Martins',
      value: 50.0,
      dueDate: '2024-07-25',
      status: 'Pago',
    },
     {
      id: 'PAR-006',
      client: 'João da Silva',
      value: 150.0,
      dueDate: '2024-08-30',
      status: 'Pendente',
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pago':
        return 'default';
      case 'Pendente':
        return 'secondary';
      case 'Não Pago':
        return 'destructive';
      default:
        return 'outline';
    }
  }
  
  export default function InstallmentsPage() {
    return (
      <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold">Parcelas</h1>
  
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Parcelas</CardTitle>
            <CardDescription>
              Acompanhe o status de pagamento de todas as parcelas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID da Parcela</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installments.map((installment) => (
                  <TableRow key={installment.id}>
                    <TableCell className="font-medium">{installment.id}</TableCell>
                    <TableCell>{installment.client}</TableCell>
                    <TableCell className="text-right">
                      {installment.value.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(installment.dueDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(installment.status)}>
                        {installment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }
  
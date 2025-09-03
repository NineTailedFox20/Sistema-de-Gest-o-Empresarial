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
  import { AddClientDialog } from '@/components/clients/add-client-dialog';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { Button } from '@/components/ui/button';
  import { MoreHorizontal } from 'lucide-react';
  
  const clients = [
    {
      name: 'João da Silva',
      email: 'joao.silva@example.com',
      status: 'Ativo',
      cpf: '123.456.789-00',
      phone: '(11) 98765-4321',
    },
    {
      name: 'Maria Oliveira',
      email: 'maria.oliveira@example.com',
      status: 'Ativo',
      cpf: '234.567.890-11',
      phone: '(21) 91234-5678',
    },
    {
      name: 'Carlos Pereira',
      email: 'carlos.pereira@example.com',
      status: 'Inativo',
      cpf: '345.678.901-22',
      phone: '(31) 95678-1234',
    },
    {
      name: 'Ana Costa',
      email: 'ana.costa@example.com',
      status: 'Ativo',
      cpf: '456.789.012-33',
      phone: '(41) 98765-8765',
    },
    {
      name: 'Pedro Martins',
      email: 'pedro.martins@example.com',
      status: 'Pendente',
      cpf: '567.890.123-44',
      phone: '(51) 94321-9876',
    },
  ];
  
  export default function ClientsPage() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">Clientes</h1>
          <AddClientDialog />
        </div>
  
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              Gerencie seus clientes e veja seus detalhes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">CPF</TableHead>
                  <TableHead className="hidden md:table-cell">Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.email}>
                    <TableCell>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground md:hidden">
                        {client.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.cpf}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.phone}
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'Ativo' ? 'secondary' : 'outline'}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
  
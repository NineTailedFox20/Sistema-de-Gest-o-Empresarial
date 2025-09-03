
'use client';
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
import { AddClientDialog, ClientFormValues } from '@/components/clients/add-client-dialog';
import { EditClientDialog } from '@/components/clients/edit-client-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const initialClients = [
  {
    id: 'CLI-001',
    name: 'João da Silva',
    email: 'joao.silva@example.com',
    status: 'Ativo',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123',
    number: '123',
    neighborhood: 'Centro',
    zip: '12345-678',
    reference: 'Perto do mercado',
    totalInstallments: 2,
    totalValue: 300.0,
  },
  {
    id: 'CLI-002',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@example.com',
    status: 'Ativo',
    cpf: '234.567.890-11',
    phone: '(21) 91234-5678',
    address: 'Avenida Brasil, 456',
    number: '456',
    neighborhood: 'Copacabana',
    zip: '23456-789',
    reference: '',
    totalInstallments: 1,
    totalValue: 200.5,
  },
  {
    id: 'CLI-003',
    name: 'Carlos Pereira',
    email: 'carlos.pereira@example.com',
    status: 'Inativo',
    cpf: '345.678.901-22',
    phone: '(31) 95678-1234',
    address: 'Praça da Liberdade, 789',
    number: '789',
    neighborhood: 'Savassi',
    zip: '34567-890',
    reference: 'Em frente à fonte',
    totalInstallments: 1,
    totalValue: 75.25,
  },
  {
    id: 'CLI-004',
    name: 'Ana Costa',
    email: 'ana.costa@example.com',
    status: 'Ativo',
    cpf: '456.789.012-33',
    phone: '(41) 98765-8765',
    address: 'Rua 24 Horas, 101',
    number: '101',
    neighborhood: 'Batel',
    zip: '45678-901',
    reference: '',
    totalInstallments: 1,
    totalValue: 300.0,
  },
  {
    id: 'CLI-005',
    name: 'Pedro Martins',
    email: 'pedro.martins@example.com',
    status: 'Pendente',
    cpf: '567.890.123-44',
    phone: '(51) 94321-9876',
    address: 'Avenida Ipiranga, 202',
    number: '202',
    neighborhood: 'Cidade Baixa',
    zip: '56789-012',
    reference: 'Ao lado da farmácia',
    totalInstallments: 1,
    totalValue: 50.0,
  },
];

export type Client = typeof initialClients[0];

export default function ClientsPage() {
  const [clients, setClients] = useState(initialClients);
  const { toast } = useToast();

  const addClient = (clientData: ClientFormValues) => {
    const newId = `CLI-${(
      Math.max(...clients.map((c) => parseInt(c.id.split('-')[1]))) + 1
    )
      .toString()
      .padStart(3, '0')}`;
      
    const newClient: Client = {
      ...clientData,
      id: newId,
      email: `${clientData.name.toLowerCase().replace(/\s/g, '.')}@example.com`,
      status: 'Ativo',
      totalInstallments: 0,
      totalValue: 0,
    };

    setClients([...clients, newClient]);
    toast({
      title: 'Cliente Adicionado!',
      description: `${newClient.name} foi adicionado com sucesso.`,
    });
  };

  const editClient = (updatedClient: Client) => {
    setClients(
      clients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
    toast({
      title: 'Cliente Atualizado!',
      description: `Os dados de ${updatedClient.name} foram atualizados.`,
    });
  };

  const deleteClient = (id: string) => {
    const clientName = clients.find(c => c.id === id)?.name;
    setClients(clients.filter((client) => client.id !== id));
    toast({
      title: 'Cliente Removido!',
      description: `${clientName} foi removido com sucesso.`,
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Clientes</h1>
        <AddClientDialog onAddClient={addClient} />
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
                <TableHead className="hidden sm:table-cell">
                  Parcelas
                </TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/installments?client=${encodeURIComponent(
                        client.name
                      )}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {client.name}
                    </Link>
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
                  <TableCell className="hidden sm:table-cell">
                    {client.totalInstallments}
                  </TableCell>
                  <TableCell className="text-right">
                    {client.totalValue.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={client.status === 'Ativo' ? 'secondary' : 'outline'}
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <EditClientDialog client={client} onEditClient={editClient} />
                         <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button
                              variant="ghost"
                              className="w-full justify-start text-sm text-destructive font-normal h-8 px-2"
                            >
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso irá remover permanentemente o cliente e todas as suas parcelas associadas.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteClient(client.id)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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

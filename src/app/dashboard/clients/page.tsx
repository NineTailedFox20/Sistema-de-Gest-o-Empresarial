
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
import { useState, useEffect } from 'react';
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
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type Client = {
  id: string;
  name: string;
  email: string;
  status: string;
  cpf: string;
  phone: string;
  address: string;
  number: string;
  neighborhood: string;
  zip: string;
  reference?: string;
  totalInstallments: number;
  totalValue: number;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      const q = query(collection(db, 'clients'));
      const querySnapshot = await getDocs(q);
      const clientsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Client));
      setClients(clientsData);
    };
    fetchClients();
  }, []);

  const addClient = async (clientData: ClientFormValues) => {
    try {
      const newClientData = {
        ...clientData,
        email: `${clientData.name.toLowerCase().replace(/\s/g, '.')}@example.com`,
        status: 'Ativo',
        totalInstallments: 0,
        totalValue: 0,
      };
      const docRef = await addDoc(collection(db, 'clients'), newClientData);
      setClients([...clients, { id: docRef.id, ...newClientData }]);
      toast({
        title: 'Cliente Adicionado!',
        description: `${clientData.name} foi adicionado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Não foi possível adicionar o cliente.',
        variant: 'destructive',
      });
    }
  };

  const editClient = async (updatedClient: Client) => {
    try {
      const clientRef = doc(db, 'clients', updatedClient.id);
      await updateDoc(clientRef, { ...updatedClient });
      setClients(
        clients.map((client) =>
          client.id === updatedClient.id ? updatedClient : client
        )
      );
      toast({
        title: 'Cliente Atualizado!',
        description: `Os dados de ${updatedClient.name} foram atualizados.`,
      });
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Não foi possível atualizar o cliente.',
        variant: 'destructive',
      });
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const clientName = clients.find((c) => c.id === id)?.name;
      await deleteDoc(doc(db, 'clients', id));
      setClients(clients.filter((client) => client.id !== id));
      toast({
        title: 'Cliente Removido!',
        description: `${clientName} foi removido com sucesso.`,
        variant: 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Não foi possível remover o cliente.',
        variant: 'destructive',
      });
    }
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

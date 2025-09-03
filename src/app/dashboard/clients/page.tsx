
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
import { useState, useEffect, useCallback } from 'react';
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
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, writeBatch, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { addMonths, format } from 'date-fns';

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
    const q = query(collection(db, 'clients'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clientsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Client));
      setClients(clientsData);
    }, (error) => {
      console.error("Error fetching clients: ", error);
      toast({
        title: 'Erro!',
        description: 'Não foi possível carregar os clientes.',
        variant: 'destructive',
      });
    });

    return () => unsubscribe();
  }, [toast]);

  const addClient = async (clientData: ClientFormValues) => {
    const { totalValue, numberOfInstallments, ...newClientDetails } = clientData;
    const batch = writeBatch(db);

    try {
        // 1. Create the client document
        const newClientData = {
            ...newClientDetails,
            email: `${clientData.name.toLowerCase().replace(/\s/g, '.')}@example.com`,
            status: 'Ativo',
            totalInstallments: numberOfInstallments,
            totalValue: totalValue,
        };
        const clientRef = doc(collection(db, 'clients'));
        batch.set(clientRef, newClientData);

        // 2. Create installment documents
        const installmentValue = totalValue / numberOfInstallments;
        const today = new Date();

        for (let i = 0; i < numberOfInstallments; i++) {
            const dueDate = addMonths(today, i + 1);
            const installmentData = {
                client: clientData.name,
                value: installmentValue,
                dueDate: format(dueDate, 'yyyy-MM-dd'),
                status: 'Pendente',
            };
            const installmentRef = doc(collection(db, 'installments'));
            batch.set(installmentRef, installmentData);
        }

        await batch.commit();

        toast({
            title: 'Cliente e Parcelas Adicionados!',
            description: `${clientData.name} e ${numberOfInstallments} parcelas foram criados com sucesso.`,
        });

    } catch (error) {
        console.error("Error adding client and installments: ", error);
        toast({
            title: 'Erro!',
            description: 'Não foi possível adicionar o cliente e suas parcelas.',
            variant: 'destructive',
        });
    }
  };

  const editClient = async (updatedClient: Client) => {
    try {
      const clientRef = doc(db, 'clients', updatedClient.id);
      const { id, ...clientData } = updatedClient;
      await updateDoc(clientRef, clientData);
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
      const clientToDelete = clients.find((c) => c.id === id);
      if (!clientToDelete) return;

      const batch = writeBatch(db);

      const clientRef = doc(db, 'clients', id);
      batch.delete(clientRef);
      
      const installmentsQuery = query(collection(db, 'installments'), where('client', '==', clientToDelete.name));
      const installmentsSnapshot = await getDocs(installmentsQuery);
      installmentsSnapshot.forEach((installmentDoc) => {
        batch.delete(doc(db, 'installments', installmentDoc.id));
      });
      
      await batch.commit();

      toast({
        title: 'Cliente Removido!',
        description: `${clientToDelete.name} e todas as suas parcelas foram removidos.`,
        variant: 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Não foi possível remover o cliente e suas parcelas.',
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
                    {client.totalInstallments || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    {(client.totalValue || 0).toLocaleString('pt-BR', {
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

    
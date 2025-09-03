
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AddInstallmentDialog, AddInstallmentForm } from '@/components/installments/add-installment-dialog';
import { EditInstallmentDialog } from '@/components/installments/edit-installment-dialog';
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

export type Installment = {
  id: string;
  client: string;
  value: number;
  dueDate: string;
  status: string;
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Pago':
      return 'secondary';
    case 'Pendente':
      return 'default';
    case 'Não Pago':
      return 'destructive';
    default:
      return 'outline';
  }
};

function InstallmentsTable() {
  const searchParams = useSearchParams();
  const clientFilter = searchParams.get('client');
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInstallments = async () => {
      let q;
      if (clientFilter) {
        q = query(collection(db, 'installments'), where('client', '==', clientFilter));
      } else {
        q = query(collection(db, 'installments'));
      }
      const querySnapshot = await getDocs(q);
      const installmentsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Installment));
      setInstallments(installmentsData);
    };
    fetchInstallments();
  }, [clientFilter]);

  const filteredInstallments = clientFilter
    ? installments.filter((i) => i.client === clientFilter)
    : installments;

  const addInstallment = async (installmentData: AddInstallmentForm) => {
    try {
      const newInstallmentData = {
        ...installmentData,
        dueDate: installmentData.dueDate.toISOString().split('T')[0],
      };
      const docRef = await addDoc(collection(db, 'installments'), newInstallmentData);
      setInstallments([...installments, { id: docRef.id, ...newInstallmentData }]);
      toast({
        title: 'Parcela Adicionada!',
        description: `A parcela para ${newInstallmentData.client} foi adicionada.`,
      });
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Não foi possível adicionar a parcela.',
        variant: 'destructive',
      });
    }
  };

  const editInstallment = async (updatedInstallment: Installment) => {
    try {
      const installmentRef = doc(db, 'installments', updatedInstallment.id);
      await updateDoc(installmentRef, { ...updatedInstallment });
      setInstallments(
        installments.map((installment) =>
          installment.id === updatedInstallment.id
            ? updatedInstallment
            : installment
        )
      );
      toast({
        title: 'Parcela Atualizada!',
        description: `A parcela ${updatedInstallment.id} foi atualizada.`,
      });
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Não foi possível atualizar a parcela.',
        variant: 'destructive',
      });
    }
  };

  const deleteInstallment = async (id: string) => {
    try {
      const installmentClient = installments.find(i => i.id === id)?.client;
      await deleteDoc(doc(db, 'installments', id));
      setInstallments(installments.filter((installment) => installment.id !== id));
      toast({
        title: 'Parcela Removida!',
        description: `A parcela de ${installmentClient} foi removida com sucesso.`,
        variant: 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Não foi possível remover a parcela.',
        variant: 'destructive',
      });
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedRows(filteredInstallments.map((i) => i.id));
    } else {
      setSelectedRows([]);
    }
  };

  const isAllSelected = selectedRows.length === filteredInstallments.length && filteredInstallments.length > 0;
  const isSomeSelected = selectedRows.length > 0 && !isAllSelected;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Parcelas</h1>
          {clientFilter && (
            <p className="text-muted-foreground">
              Mostrando parcelas para: <strong>{clientFilter}</strong>
            </p>
          )}
        </div>
        <AddInstallmentDialog onAddInstallment={addInstallment} />
      </div>

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
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={isAllSelected ? true : isSomeSelected ? 'indeterminate' : false}
                    onCheckedChange={handleSelectAll}
                    aria-label="Selecionar tudo"
                  />
                </TableHead>
                <TableHead>ID da Parcela</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstallments.map((installment) => (
                <TableRow
                  key={installment.id}
                  data-state={selectedRows.includes(installment.id) && 'selected'}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(installment.id)}
                      onCheckedChange={() => handleSelectRow(installment.id)}
                      aria-label="Selecionar linha"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{installment.id}</TableCell>
                  <TableCell>{installment.client}</TableCell>
                  <TableCell className="text-right">
                    {installment.value.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(installment.dueDate).toLocaleDateString('pt-BR', {
                      timeZone: 'UTC',
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(installment.status)}>
                      {installment.status}
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
                        <EditInstallmentDialog
                          installment={installment}
                          onEditInstallment={editInstallment}
                        />
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
                                Essa ação não pode ser desfeita. Isso irá remover permanentemente a parcela.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteInstallment(installment.id)}>
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


export default function InstallmentsPage() {
    return (
        <InstallmentsTable />
    )
}

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { AddUserDialog, UserFormValues } from '@/components/users/add-user-dialog';
import { EditUserDialog } from '@/components/users/edit-user-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';


const initialUsers = [
  {
    id: 'USR-001',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    role: 'Dono',
    avatar: '1',
  },
  {
    id: 'USR-002',
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    role: 'Funcionário',
    avatar: '2',
  },
  {
    id: 'USR-003',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    role: 'Vendedor',
    avatar: '3',
  },
  {
    id: 'USR-004',
    name: 'Diana Miller',
    email: 'diana.m@example.com',
    role: 'Usuário',
    avatar: '4',
  },
];

export type User = typeof initialUsers[0];
export type UserRole = 'Dono' | 'Funcionário' | 'Vendedor' | 'Usuário';

const getRoleVariant = (role: string) => {
  switch (role) {
    case 'Dono':
      return 'default';
    case 'Funcionário':
      return 'secondary';
    case 'Vendedor':
      return 'outline';
    default:
      return 'outline';
  }
};

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const { toast } = useToast();

  const addUser = (userData: UserFormValues) => {
    const newId = `USR-${(
      Math.max(0, ...users.map((u) => parseInt(u.id.split('-')[1]))) + 1
    )
      .toString()
      .padStart(3, '0')}`;
    
    const newUser: User = {
      id: newId,
      ...userData,
      avatar: (Math.floor(Math.random() * 100) + 1).toString(),
    };
    setUsers([...users, newUser]);
    toast({
      title: 'Usuário Adicionado!',
      description: `${newUser.name} foi adicionado ao sistema.`,
    });
  };

  const editUser = (updatedUser: User) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    toast({
      title: 'Usuário Atualizado!',
      description: `As informações de ${updatedUser.name} foram atualizadas.`,
    });
  };
  
  const deleteUser = (userId: string) => {
    const userName = users.find(u => u.id === userId)?.name;
    setUsers(users.filter((user) => user.id !== userId));
     toast({
      title: 'Usuário Removido!',
      description: `${userName} foi removido do sistema.`,
      variant: 'destructive',
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold">Usuários</h1>
            <p className="text-muted-foreground">Esta página é visível apenas para o Dono.</p>
        </div>
        <AddUserDialog onAddUser={addUser} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Visualize e gerencie as permissões dos usuários do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://picsum.photos/id/${user.avatar}/40/40`}
                        />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name} {user.role === 'Dono' && '(Dono)'}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                          disabled={user.role === 'Dono'}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <EditUserDialog user={user} onEditUser={editUser} />
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button
                              variant="ghost"
                              className="w-full justify-start text-sm text-destructive font-normal h-8 px-2 hover:text-destructive"
                            >
                              Remover Usuário
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso irá remover permanentemente o usuário do sistema.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteUser(user.id)}>
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
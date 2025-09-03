
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
import { useState, useEffect } from 'react';
import { AddUserDialog, UserFormValues } from '@/components/users/add-user-dialog';
import { EditUserDialog } from '@/components/users/edit-user-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Dono' | 'Funcionário' | 'Vendedor' | 'Usuário';
  avatar: string;
};
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
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const seedOwner = async () => {
      const ownerEmail = 'ufelpe7w7@gmail.com';
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where("email", "==", ownerEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        try {
          // Note: This only creates the user in Firestore.
          // The auth user must be created separately through the registration flow.
          // For this app, we'll assume the owner registers through the UI.
          // To properly seed, you'd need a backend function.
          // We will create the user in auth database as well to make it fully functional.
          const password = '@Felipe7w7';
          const userCredential = await createUserWithEmailAndPassword(auth, ownerEmail, password).catch(
            (err) => {
              if(err.code !== 'auth/email-already-in-use') {
                throw err;
              }
              return null;
            }
          );
          
          const newUserData = {
            name: 'Felipe (Dono)',
            email: ownerEmail,
            role: 'Dono' as UserRole,
            avatar: (Math.floor(Math.random() * 100) + 1).toString(),
            uid: userCredential ? userCredential.user.uid : undefined
          };
          const docRef = await addDoc(usersRef, newUserData);
          setUsers(prevUsers => [...prevUsers, {id: docRef.id, ...newUserData}]);
          toast({
            title: 'Usuário Dono Criado!',
            description: `O usuário Dono padrão foi configurado.`,
          });
        } catch (error) {
            console.error("Error seeding owner: ", error);
             toast({
                title: 'Erro ao Criar Dono!',
                description: 'Não foi possível criar o usuário dono padrão.',
                variant: 'destructive',
            });
        }
      }
    };
    
    const fetchUsers = async () => {
      await seedOwner();
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  const addUser = async (userData: UserFormValues) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const newUser = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: (Math.floor(Math.random() * 100) + 1).toString(),
        uid: userCredential.user.uid,
      };
      const docRef = await addDoc(collection(db, 'users'), newUser);
      setUsers([...users, { id: docRef.id, ...newUser }]);
      toast({
        title: 'Usuário Adicionado!',
        description: `${newUser.name} foi adicionado ao sistema.`,
      });
    } catch (error: any) {
      let errorMessage = 'Não foi possível adicionar o usuário.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso por outra conta.';
      }
       toast({
        title: 'Erro!',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const editUser = async (updatedUser: User) => {
    try {
      const userRef = doc(db, 'users', updatedUser.id);
      await updateDoc(userRef, { ...updatedUser });
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      toast({
        title: 'Usuário Atualizado!',
        description: `As informações de ${updatedUser.name} foram atualizadas.`,
      });
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Não foi possível atualizar o usuário.',
        variant: 'destructive',
      });
    }
  };
  
  const deleteUser = async (userId: string) => {
    try {
      const userName = users.find(u => u.id === userId)?.name;
      // Note: This only deletes from Firestore. Deleting from Firebase Auth
      // requires admin privileges and is typically done from a backend.
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter((user) => user.id !== userId));
      toast({
        title: 'Usuário Removido!',
        description: `${userName} foi removido do sistema.`,
        variant: 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Não foi possível remover o usuário.',
        variant: 'destructive',
      });
    }
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

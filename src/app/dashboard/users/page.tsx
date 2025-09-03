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
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent
  } from '@/components/ui/dropdown-menu';
  import { Button } from '@/components/ui/button';
  import { MoreHorizontal } from 'lucide-react';
  
  const users = [
    {
      name: 'Alice Johnson (Dono)',
      email: 'alice.j@example.com',
      role: 'Dono',
      avatar: '1',
    },
    {
      name: 'Bob Williams',
      email: 'bob.w@example.com',
      role: 'Funcionário',
      avatar: '2',
    },
    {
      name: 'Charlie Brown',
      email: 'charlie.b@example.com',
      role: 'Vendedor',
      avatar: '3',
    },
    {
      name: 'Diana Miller',
      email: 'diana.m@example.com',
      role: 'Usuário',
      avatar: '4',
    },
  ];

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
  }
  
  export default function UsersPage() {
    return (
      <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold">Usuários</h1>
        <p className="text-muted-foreground">Esta página é visível apenas para o Dono.</p>
  
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
                  <TableRow key={user.email}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://picsum.photos/id/${user.avatar}/40/40`} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
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
                          <Button aria-haspopup="true" size="icon" variant="ghost" disabled={user.role === 'Dono'}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                           <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Alterar Papel</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>Funcionário</DropdownMenuItem>
                                <DropdownMenuItem>Vendedor</DropdownMenuItem>
                                <DropdownMenuItem>Usuário</DropdownMenuItem>
                            </DropdownMenuSubContent>
                           </DropdownMenuSub>
                          <DropdownMenuItem className="text-destructive">Remover Usuário</DropdownMenuItem>
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
  
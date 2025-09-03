'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  cpf: z.string().length(14, { message: 'O CPF deve ter 11 dígitos.' }),
  phone: z.string().min(10, { message: 'O telefone é inválido.' }),
  address: z.string().min(5, { message: 'O endereço é muito curto.' }),
  number: z.string().min(1, { message: 'O número é obrigatório.' }),
  neighborhood: z.string().min(3, { message: 'O bairro é obrigatório.' }),
  zip: z.string().length(9, { message: 'O CEP deve ter 8 dígitos.' }),
  reference: z.string().optional(),
});

export function AddClientDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      cpf: '',
      phone: '',
      address: '',
      number: '',
      neighborhood: '',
      zip: '',
      reference: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Cliente Adicionado!',
      description: `${values.name} foi adicionado com sucesso.`,
    });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Adicionar Cliente
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Adicionar Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo cliente.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                        <Input placeholder="Nome do Cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                        <Input placeholder="000.000.000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                        <Input placeholder="(00) 90000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-3">
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Endereço</FormLabel>
                            <FormControl>
                                <Input placeholder="Rua, Av, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="md:col-span-2">
                     <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Número</FormLabel>
                            <FormControl>
                                <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                            <Input placeholder="Centro" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                            <Input placeholder="00000-000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Ponto de Referência</FormLabel>
                    <FormControl>
                        <Input placeholder="Próximo a..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
                <Button type="submit">Salvar Cliente</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { StatusChart } from '@/components/dashboard/status-chart';
import { RevenueForecast } from '@/components/dashboard/revenue-forecast';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardData {
  totalRevenue: number;
  totalClients: number;
  totalSales: number;
  activeNow: number;
  revenueChange: string;
  clientsChange: string;
  salesChange: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clientsQuery = query(collection(db, 'clients'));
    const installmentsQuery = query(collection(db, 'installments'));

    const unsubscribes = [
      onSnapshot(clientsQuery, (clientsSnapshot) => {
        const totalClients = clientsSnapshot.size;
        const totalRevenue = clientsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().totalValue || 0), 0);
        const activeClients = clientsSnapshot.docs.filter(doc => doc.data().status === 'Ativo').length;

        setData(prevData => ({
          ...(prevData || {
                totalRevenue: 0,
                totalClients: 0,
                totalSales: 0,
                activeNow: 0,
                revenueChange: "+20.1%",
                clientsChange: "+180.1%",
                salesChange: "+19%",
            }),
          totalClients,
          totalRevenue,
          activeNow: activeClients,
        }));
        setLoading(false);
      }),
      onSnapshot(installmentsQuery, (installmentsSnapshot) => {
        const paidInstallments = installmentsSnapshot.docs.filter(doc => doc.data().status === 'Pago').length;
        setData(prevData => ({
          ...(prevData || {
                totalRevenue: 0,
                totalClients: 0,
                totalSales: 0,
                activeNow: 0,
                revenueChange: "+20.1%",
                clientsChange: "+180.1%",
                salesChange: "+19%",
          }),
          totalSales: paidInstallments,
        }));
        setLoading(false);
      })
    ];

    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  if (loading || !data) {
    return (
        <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vendas</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle className="font-headline">Visão Geral</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                   <Skeleton className="h-[350px] w-full" />
                </CardContent>
            </Card>
            <div className="col-span-4 lg:col-span-3 space-y-4 flex flex-col">
                <StatusChart />
                <RevenueForecast />
            </div>
        </div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                 {data.totalRevenue.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.revenueChange} em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {data.clientsChange} em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              {data.salesChange} em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.activeNow}</div>
            <p className="text-xs text-muted-foreground">
              Total de clientes com status ativo
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart />
          </CardContent>
        </Card>
        <div className="col-span-4 lg:col-span-3 space-y-4 flex flex-col">
            <StatusChart />
            <RevenueForecast />
        </div>
      </div>
    </div>
  );
}

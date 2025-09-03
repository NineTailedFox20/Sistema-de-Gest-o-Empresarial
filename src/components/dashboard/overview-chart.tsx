'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

type ChartData = {
  name: string;
  total: number;
}[];

const fetchRevenueData = async (): Promise<ChartData> => {
  const installmentsSnapshot = await getDocs(
    query(collection(db, 'installments'), where('status', '==', 'Pago'))
  );

  const monthlyRevenue: { [key: number]: number } = {};

  installmentsSnapshot.forEach((doc) => {
    const installment = doc.data();
    const date = new Date(installment.dueDate + 'T00:00:00'); // Assume UTC
    const month = date.getMonth();
    const value = installment.value;

    if (monthlyRevenue[month]) {
      monthlyRevenue[month] += value;
    } else {
      monthlyRevenue[month] = value;
    }
  });

  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const chartData = monthNames.map((name, index) => ({
    name: name,
    total: monthlyRevenue[index] || 0,
  }));
  
  return chartData;
};


export function OverviewChart() {
  const [data, setData] = useState<ChartData | null>(null);

  useEffect(() => {
    fetchRevenueData().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center">
         <Skeleton className="h-[300px] w-[95%]" />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `R$${value}`}
        />
        <Bar
          dataKey="total"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

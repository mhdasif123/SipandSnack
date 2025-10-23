"use client";

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Users } from 'lucide-react';
import { Order } from '@/lib/data';
import { format, isWithinInterval, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, parseISO } from 'date-fns';
import { ReportGenerator } from './report-generator';

type DashboardProps = {
  initialOrders: Order[];
};

type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'all';

const filterOrdersByTimeframe = (orders: Order[], timeframe: TimeFrame) => {
  const now = new Date();
  let interval: Interval | null = null;

  switch (timeframe) {
    case 'daily':
      interval = { start: startOfDay(now), end: endOfDay(now) };
      break;
    case 'weekly':
      interval = { start: startOfWeek(now), end: endOfWeek(now) };
      break;
    case 'monthly':
      interval = { start: startOfMonth(now), end: endOfMonth(now) };
      break;
    case 'all':
    default:
      return orders;
  }
  
  return orders.filter(order => isWithinInterval(parseISO(order.orderDate), interval!));
};

export function AdminDashboard({ initialOrders }: DashboardProps) {
  const [timeframe, setTimeframe] = useState<TimeFrame>('daily');

  const filteredOrders = useMemo(() => {
    return filterOrdersByTimeframe(initialOrders, timeframe)
  }, [initialOrders, timeframe]);

  const stats = useMemo(() => {
    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = filteredOrders.length;
    const uniqueEmployees = new Set(filteredOrders.map(o => o.employeeName)).size;
    return { totalAmount, totalOrders, uniqueEmployees };
  }, [filteredOrders]);

  return (
    <div className="space-y-8">
      <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as TimeFrame)}>
          <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">₹</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueEmployees}</div>
          </CardContent>
        </Card>
      </div>

      <ReportGenerator orders={initialOrders} />

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Tea</TableHead>
                <TableHead>Snack</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.employeeName}</TableCell>
                    <TableCell>{order.tea}</TableCell>
                    <TableCell>{order.snack}</TableCell>
                    <TableCell className="text-right">₹{order.amount.toFixed(2)}</TableCell>
                    <TableCell>{format(parseISO(order.orderDate), 'PPp')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No orders for this period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

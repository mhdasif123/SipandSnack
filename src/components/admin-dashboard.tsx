"use client";

import { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, ShoppingBag, Users, Download, Calendar as CalendarIcon, FileDown } from 'lucide-react';
import { Order } from '@/lib/data';
import { format, isWithinInterval, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import Papa from 'papaparse';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Label } from './ui/label';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

type DashboardProps = {
  initialOrders: Order[];
};

type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'all' | 'custom';

const filterOrdersByTimeframe = (orders: Order[], timeframe: TimeFrame, dateRange?: DateRange) => {
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
    case 'custom':
      if (dateRange?.from) {
        interval = {
            start: startOfDay(dateRange.from),
            end: dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from),
        }
      } else {
        return [];
      }
      break;
    case 'all':
    default:
      return orders;
  }
  
  return orders.filter(order => isWithinInterval(parseISO(order.orderDate), interval!));
};

const exportToCsv = (data: Order[], timeframe: TimeFrame, dateRange?: DateRange) => {
    const csvData = data.map(order => ({
        'Employee': order.employeeName,
        'Tea': order.tea,
        'Snack': order.snack,
        'Amount': order.amount.toFixed(2),
        'Date': format(parseISO(order.orderDate), 'yyyy-MM-dd HH:mm:ss'),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    let filename = `sip-and-snack-orders-${timeframe}`;
    if (timeframe === 'custom' && dateRange?.from) {
        filename += `-${format(dateRange.from, 'yyyy-MM-dd')}`;
        if (dateRange.to) {
            filename += `_to_${format(dateRange.to, 'yyyy-MM-dd')}`;
        }
    }
    filename += '.csv';
    
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const exportToPdf = (data: Order[], dateRange: DateRange) => {
    const doc = new jsPDF();
    const tableColumn = ["Employee", "Tea", "Snack", "Amount", "Date"];
    const tableRows: any[] = [];

    data.forEach(order => {
        const orderData = [
            order.employeeName,
            order.tea,
            order.snack,
            `₹${order.amount.toFixed(2)}`,
            format(parseISO(order.orderDate), 'yyyy-MM-dd HH:mm:ss'),
        ];
        tableRows.push(orderData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });
    
    doc.text("Sip & Snack Order Report", 14, 15);
    doc.save(`sip-and-snack-orders-${format(dateRange.from!, 'yyyy-MM-dd')}_to_${format(dateRange.to!, 'yyyy-MM-dd')}.pdf`);
}


function ReportGenerator({ orders }: { orders: Order[] }) {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [reportData, setReportData] = useState<Order[] | null>(null);

    const handleRunReport = () => {
        if(dateRange?.from && dateRange?.to) {
            const filtered = orders.filter(order => isWithinInterval(parseISO(order.orderDate), { start: startOfDay(dateRange.from!), end: endOfDay(dateRange.to!) }));
            setReportData(filtered);
        } else {
            setReportData(null);
        }
    }

    return (
         <Card>
            <CardHeader>
                <CardTitle>Generate Report</CardTitle>
                <CardDescription>Select a date range to generate and export a report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="grid gap-2 flex-1">
                        <Label>From Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className="justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.from ? format(dateRange.from, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dateRange?.from}
                                    onSelect={(day) => setDateRange(prev => ({...prev, from: day}))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="grid gap-2 flex-1">
                        <Label>To Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className="justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.to ? format(dateRange.to, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dateRange?.to}
                                    onSelect={(day) => setDateRange(prev => ({...prev, to: day}))}
                                    disabled={{ before: dateRange?.from }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <Button onClick={handleRunReport} disabled={!dateRange?.from || !dateRange?.to}>
                        Run Report
                    </Button>
                    {reportData && (
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => exportToPdf(reportData, dateRange!)}>
                                    Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => exportToCsv(reportData, 'custom', dateRange)}>
                                    Export as Excel (CSV)
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {reportData && (
                     <div className="rounded-md border">
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
                            {reportData.length > 0 ? (
                                reportData.map((order) => (
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
                                    No orders found for this period.
                                </TableCell>
                                </TableRow>
                            )}
                            </TableBody>
                        </Table>
                     </div>
                )}


            </CardContent>
        </Card>
    );
}

export function AdminDashboard({ initialOrders }: DashboardProps) {
  const [timeframe, setTimeframe] = useState<TimeFrame>('daily');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleTimeframeChange = (value: string) => {
    const newTimeframe = value as TimeFrame;
    if (newTimeframe !== 'custom') {
        setDateRange(undefined);
    }
    setTimeframe(newTimeframe);
  }

  const filteredOrders = useMemo(() => {
    if (timeframe === 'custom' && !dateRange?.from) return [];
    return filterOrdersByTimeframe(initialOrders, timeframe, dateRange)
  }, [initialOrders, timeframe, dateRange]);

  const stats = useMemo(() => {
    const totalAmount = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = filteredOrders.length;
    const uniqueEmployees = new Set(filteredOrders.map(o => o.employeeName)).size;
    return { totalAmount, totalOrders, uniqueEmployees };
  }, [filteredOrders]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs value={timeframe} onValueChange={handleTimeframeChange}>
            <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className="w-[280px] justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                            <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                            </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => {
                        setDateRange(range);
                        if (range?.from) {
                            setTimeframe('custom');
                        }
                    }}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
            <Button 
                onClick={() => exportToCsv(filteredOrders, timeframe, dateRange)}
                disabled={filteredOrders.length === 0}
            >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
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

    
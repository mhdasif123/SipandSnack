"use client";

import { useState } from 'react';
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
import { Calendar as CalendarIcon, FileDown } from 'lucide-react';
import { Order } from '@/lib/data';
import { format, isWithinInterval, startOfDay, endOfDay, parseISO } from 'date-fns';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import Papa from 'papaparse';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Label } from './ui/label';
import { jsPDF } from "jspdf";
import "jspdf-autotable";


const exportToCsv = (data: Order[], dateRange?: DateRange) => {
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
    let filename = `sip-and-snack-orders-custom`;
    if (dateRange?.from) {
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

    const fromDate = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : 'start';
    const toDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : 'end';


    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });
    
    doc.text(`Sip & Snack Order Report (${fromDate} to ${toDate})`, 14, 15);
    doc.save(`sip-and-snack-orders-${fromDate}_to_${toDate}.pdf`);
}


export function ReportGenerator({ orders }: { orders: Order[] }) {
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
                                    disabled={dateRange?.from ? { before: dateRange.from } : undefined}
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
                                <DropdownMenuItem onClick={() => exportToCsv(reportData, dateRange)}>
                                    Export as Excel (CSV)
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {reportData && (
                     <div className="rounded-md border mt-4">
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
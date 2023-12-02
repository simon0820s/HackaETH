import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table'
const invoices = [
  {
    id: 'INV001',
    value: '$250.00',
    months: '3'
  },
  {
    id: 'INV002',
    value: '$150.00',
    months: '3'
  },
  {
    id: 'INV003',
    value: '$350.00',
    months: '3'
  },
  {
    id: 'INV004',
    value: '$450.00',
    months: '3'
  },
  {
    id: 'INV005',
    value: '$550.00',
    months: '3'
  },
  {
    id: 'INV006',
    value: '$200.00',
    months: '3'
  },
  {
    id: 'INV007',
    value: '$300.00',
    months: '3'
  }
]

function CurrentLoans () {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Historial</CardTitle>
        <CardDescription>
          En este panel podras ver tu historial de prestamos y fondeos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table className='w-full'>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center w-[100px]'>ID</TableHead>
              <TableHead className='text-center'>Valor</TableHead>
              <TableHead className='text-center'>Meses</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map(invoice => (
              <TableRow key={invoice.id}>
                <TableCell className='font-medium'>{invoice.id}</TableCell>
                <TableCell className='text-right'>{invoice.value}</TableCell>
                <TableCell className='text-right'>{invoice.months}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className='text-right'>$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}

export { CurrentLoans }

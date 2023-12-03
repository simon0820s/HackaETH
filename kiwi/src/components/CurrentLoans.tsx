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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { Button } from './ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { Input } from './ui/input'
import { useForm } from 'react-hook-form'
import useLendHistory from '@/hooks/useLendHistory'
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

const minValue = 800
const maxValue = 5000

function CurrentLoans () {
  const form = useForm()

  function onSubmit (values) {
    console.log(values)
  }

  const setMinValue = minValue => {
    form.setValue('value', minValue, { shouldValidate: true })
  }

  const { data, isLoading } = useLendHistory()

  return (
    <Card className='w-full h-fit currentLoans'>
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
                <Dialog>
                  <DialogTrigger className='cursor-pointer' asChild>
                    <TableCell className='font-medium text-blue-600 font-bold'>
                      {invoice.id}
                    </TableCell>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                      <DialogTitle>Pagar cuota</DialogTitle>
                      <DialogDescription>
                        Ponte al día con tus pagos.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8'
                      >
                        <FormField
                          control={form.control}
                          name='value'
                          rules={{
                            required: 'Este campo es requerido',
                            min: {
                              value: minValue,
                              message: `El monto debe ser mayor a: ${minValue}`
                            },
                            max: {
                              value: maxValue,
                              message: `El monto debe ser menor a: ${maxValue}`
                            }
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor</FormLabel>
                              <FormControl>
                                <Input
                                  type='number'
                                  placeholder='0'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                              <div className='w-full flex justify-end'>
                                <Button
                                  type='button'
                                  variant='ghost'
                                  onClick={() => setMinValue(minValue)}
                                >
                                  Pagar valor minimo
                                </Button>
                              </div>
                            </FormItem>
                          )}
                        />
                        <Button type='submit'>Pagar cuota</Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
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

import React, { useState } from 'react'
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
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { Button } from './ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { Input } from './ui/input'
import { useForm } from 'react-hook-form'
import useLendHistory from '@/hooks/useLendHistory'
import { Skeleton } from './ui/skeleton'
import { formatEther, parseEther } from 'viem'
import { usePayLend } from '@/hooks'

type Lend = {
  id: bigint
  amount: bigint
  quotas: bigint
  netAmount: bigint
  payed: boolean
  payedAmount: bigint
}

const minValue = 800
const maxValue = 5000

function CurrentLoans () {
  const [id, setId] = useState(null)
  const { writeAsync: payLend } = usePayLend()

  const form = useForm()

  async function onSubmit (values) {
    console.debug({ values }, id)
    await payLend({
      args: [parseInt(id), parseEther(values.value)]
    })
  }

  const setMinValue = minValue => {
    form.setValue('value', minValue, { shouldValidate: true })
  }

  const { data, isLoading } = useLendHistory()

  const lendingHistory: Lend[] = data as Lend[]

  function getTotalValue (data) {
    if (!data) return 0
    let currentValue = 0
    data.forEach(element => {
      const some = Number(element.netAmount)
      currentValue = currentValue + some / 10 ** 18
    })
    return currentValue
  }

  console.debug({ lendingHistory })

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
              <TableHead className=' w-[100px]'>ID</TableHead>
              <TableHead>Valor inicial</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Cuotas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <Skeleton />
            ) : !lendingHistory ? (
              <TableRow>
                <TableCell colSpan={4} className='text-center'>
                  No tienes prestamos activos
                </TableCell>
              </TableRow>
            ) : (
              lendingHistory.map(currentLend => (
                <TableRow key={Number(currentLend.id) }>
                  <Dialog>
                    <DialogTrigger className='cursor-pointer' asChild>
                      <TableCell className='font-medium text-blue-600 font-bold'>
                        {Number(currentLend.id)}
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
                                value: Math.floor(
                                  formatEther(
                                    currentLend.netAmount / currentLend.quotas
                                  )
                                ),
                                message: `El monto debe ser mayor a: ${Math.floor(
                                  formatEther(
                                    currentLend.netAmount / currentLend.quotas
                                  )
                                )}`
                              },
                              max: {
                                value: formatEther(currentLend.netAmount),
                                message: `El monto debe ser menor a: ${formatEther(
                                  currentLend.netAmount
                                )}`
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
                                    onClick={() => {
                                      console.debug(
                                        formatEther(
                                          currentLend.netAmount /
                                            currentLend.quotas
                                        )
                                      )
                                      setMinValue(
                                        formatEther(
                                          currentLend.netAmount /
                                            currentLend.quotas
                                        )
                                      )
                                    }}
                                  >
                                    Pagar valor minimo
                                  </Button>
                                </div>
                              </FormItem>
                            )}
                          />
                          <Button
                            onClick={() => setId(formatEther(currentLend.id))}
                            type='submit'
                          >
                            Pagar cuota
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  <TableCell className='text-right'>
                    {formatEther(currentLend.amount)}
                  </TableCell>
                  <TableCell className='text-right'>
                    {formatEther(currentLend.netAmount)}
                  </TableCell>
                  <TableCell className='text-right'>
                    {Number(currentLend.quotas as bigint)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Deuda total</TableCell>
              <TableCell className='text-right'>
                $ {getTotalValue(lendingHistory)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}

export { CurrentLoans }

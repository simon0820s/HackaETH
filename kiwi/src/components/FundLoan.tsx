import React from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { Input } from './ui/input'
import { useErc20, useFund } from '@/hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { lendingManagerAddress } from '@/constants'

function FundLoan () {
  const fundForm = useForm()
  const form = useForm()

  const { writeAsync: approve } = useErc20()

  async function onSubmit (values) {
    await approve({
      args: [lendingManagerAddress, values.value]
    })
  }

  const { writeAsync: fund, write: isFundAvailable } = useFund()

  function onFundSubmit (values) {}
  const loanForm = useForm()

  function onLoanSubmit (values) {
    console.log(values)
  }

  return (
    <Tabs defaultValue='prestar' className='w-full fundLoan'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='prestar'>Presta</TabsTrigger>
        <TabsTrigger value='fondear'>Fondea</TabsTrigger>
      </TabsList>
      <TabsContent value='prestar'>
        <Card>
          <CardHeader>
            <CardTitle>Prestamo</CardTitle>
            <CardDescription>
              En este panel podras pedir un prestamo basado en tu historial
              crediticio.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            <Form {...fundForm}>
              <form
                onSubmit={fundForm.handleSubmit(onLoanSubmit)}
                className='space-y-8'
              >
                <FormField
                  control={fundForm.control}
                  name='value'
                  rules={{
                    required: 'Este campo es requerido',
                    min: {
                      value: 0,
                      message: 'El monto debe ser mayor a 0'
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='0' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={fundForm.control}
                  name='months'
                  rules={{
                    required: 'Este campo es requerido',
                    min: {
                      value: 3,
                      message: 'El plazo debe ser mayor a 3 meses'
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meses</FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='0' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isFundAvailable ? (
                  <Button type='submit'>Solicitar prestamo</Button>
                ) : (
                  <Dialog>
                    <DialogTrigger className='cursor-pointer' asChild>
                      <Button type='button'>Solicitar prestamo</Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[425px]'>
                      <DialogHeader>
                        <DialogTitle>Preaprueba la transacción</DialogTitle>
                        <DialogDescription>
                          Para poder realizar la transacción debes tener
                          preaprobado un monto.
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
                                value: 0,
                                message: 'El monto debe ser mayor a: 0'
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
                              </FormItem>
                            )}
                          />
                          <Button type='submit'>Aprobar monto</Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value='fondear'>
        <Card>
          <CardHeader>
            <CardTitle>Fondear</CardTitle>
            <CardDescription>
              Fondea la piscina de liquidez y recibe un rendimiento por ello.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            <Form {...fundForm}>
              <form
                onSubmit={fundForm.handleSubmit(onFundSubmit)}
                className='space-y-8'
              >
                <FormField
                  control={fundForm.control}
                  name='value'
                  rules={{
                    required: 'Este campo es requerido',
                    min: {
                      value: 0,
                      message: 'El monto debe ser mayor a 0'
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='0' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit'>Fondear</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export { FundLoan }

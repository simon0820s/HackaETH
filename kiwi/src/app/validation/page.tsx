'use client'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { validate } from '@/services/validate'
import { RiImageAddLine } from 'react-icons/ri'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { useAccount } from 'wagmi'
import { useValidateUser } from '@/hooks'
import { parseEther } from 'viem'
import { redirect } from 'next/navigation'
import axios from 'axios'

function Page () {
  const [image, setImage] = useState('')
  const { address, isConnected } = useAccount()
  if (!isConnected) redirect('/')
  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLLabelElement>
  ) => {
    event.preventDefault()

    let selectedFile: File | null = null

    if ('dataTransfer' in event) {
      // Drag and Drop Event
      selectedFile = event.dataTransfer.files[0]
    } else {
      // File Input Event
      selectedFile = event.target.files && event.target.files[0]
    }

    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = () => {
        const b64Image = reader.result
        if (typeof b64Image === 'string') {
          setImage(b64Image)
        }
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const response = await validate(image)
    if (response.data.result === true) {
      await axios.post('/api/validate-user', {
        address
      })
    } else {
      toast({
        title: 'Error',
        description: response.data.message
      })
    }
    console.debug(response)
  }

  const [isDragging, setIsDragging] = useState<boolean>(false)

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }
  return (
    <section className='p-10 pt-20 flex flex-col gap-5 justify-center items-center'>
      <Card>
        <CardHeader>
          <CardTitle>Validación de identidad</CardTitle>
          <CardDescription>
            Para validar tu identidad, por favor sube una foto de tu DNI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
            <label
              className={`w-full h-full rounded-md text-slate-400 text-center flex justify-center p-10 items-center transition-all ease-in-out cursor-pointer hover:border-green-400 hover:text-green-400 flex-col gap-5 ${
                isDragging
                  ? 'border-green-400 bg-green-100'
                  : 'border-slate-400'
              } border-spacing-4 border-4 border-dashed`}
              draggable
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleImageChange}
              htmlFor='imageATT'
            >
              <RiImageAddLine className='text-8xl' />
              <p className='w-3/4 break-words'>
                Select or drag and drop an image for the token
              </p>
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              placeholder='something'
              name='imageATT'
              id='imageATT'
              className='hidden'
            />

            <Button variant='outline' type='submit'>
              Enviar
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default Page

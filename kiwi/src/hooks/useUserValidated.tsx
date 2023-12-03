'use client'
import React, { useEffect, useState } from 'react'

function useUserValidated () {
  const [isValidate, setIsValidate] = useState(true)
  useEffect(() => {
    setIsValidate(true)
  }, [])

  return isValidate
}

export { useUserValidated }

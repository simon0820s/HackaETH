'use client'
import React, { useEffect, useState } from 'react'

function useUserValidated () {
  const [isValidate, setIsValidate] = useState(false)
  useEffect(() => {
    setIsValidate(false)
  }, [])

  return isValidate
}

export { useUserValidated }

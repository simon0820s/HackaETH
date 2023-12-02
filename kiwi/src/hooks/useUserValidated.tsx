import React, { useEffect, useState } from 'react'

function useUserValidated () {
  const [isValidate, setIsValidate] = useState(false)
  useEffect(() => {
    setIsValidate(true)
  }, [])

  return isValidate
}

export { useUserValidated }

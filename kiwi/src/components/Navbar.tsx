import React from 'react'
import {
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Navbar
} from 'flowbite-react'
import Link from 'next/link'

function Nav () {
  return (
    <Navbar fluid className='backdrop-blur-sm' rounded>
      <NavbarBrand as={Link} href='https://flowbite-react.com'>
        <span className='self-center text-black whitespace-nowrap text-xl font-semibold dark:text-white'>
          Kiwi
        </span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <w3m-button />
      </NavbarCollapse>
    </Navbar>
  )
}

export { Nav }

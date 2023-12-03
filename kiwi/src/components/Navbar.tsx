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
    <Navbar fluid className='bg-slate-400 z-50 bg-opacity-10 fixed w-full bg-transparent' rounded>
      <NavbarBrand as={Link} href='/'>
        <span className='self-center kiwi text-white whitespace-nowrap text-xl font-semibold dark:text-white'>
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

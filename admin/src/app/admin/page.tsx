'use client'
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

export default function Admin() {
  useEffect(() => {
    redirect('/admin/dashboard')
  }, [])
}

import { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import { SiteHeader } from '@/components/site-header'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { supabase } from './supabaseClient'

interface DashboardProps {
  onLogout: () => void
}

export interface Employee {
  id: number
  name: string
  department: string
  position: string
  salary: any 
  address: string
  email: string
}

export default function Page({ onLogout }: DashboardProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    setIsLoading(true)
    
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error("Error fetching employees:", error)
    } else {
      setEmployees(data || [])
    }
    
    setIsLoading(false)
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 55)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant='inset' onLogout={onLogout} />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
              
              {/* Passed the employees array into the cards */}
              <div className="px-4 md:px-6">
                <SectionCards employees={employees} />
              </div>
              
              <div className="px-4 md:px-6">
                {isLoading ? (
                  <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-sm text-gray-500">
                    Loading employee data...
                  </div>
                ) : (
                  <DataTable data={employees} onDataChange={fetchEmployees} />
                )}
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
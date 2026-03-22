import * as React from 'react'
import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { LayoutDashboardIcon, CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CommandIcon } from 'lucide-react'

// 1. Import your Supabase client
// (Assuming your supabaseClient.ts is in the src folder, one level up from components)
import { supabase } from '../supabaseClient'

// Note: I removed the hardcoded 'user' object from here since we are fetching it dynamically!
const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: (
        <LayoutDashboardIcon />
      ),
    },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: (
        <CameraIcon />
      ),
      isActive: true,
      url: '#',
      items: [
        { title: 'Active Proposals', url: '#' },
        { title: 'Archived', url: '#' },
      ],
    },
    {
      title: 'Proposal',
      icon: (
        <FileTextIcon />
      ),
      url: '#',
      items: [
        { title: 'Active Proposals', url: '#' },
        { title: 'Archived', url: '#' },
      ],
    },
    {
      title: 'Prompts',
      icon: (
        <FileTextIcon />
      ),
      url: '#',
      items: [
        { title: 'Active Proposals', url: '#' },
        { title: 'Archived', url: '#' },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: (
        <Settings2Icon />
      ),
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onLogout?: () => void
}

export function AppSidebar({ onLogout, ...props }: AppSidebarProps) {
  
  // 2. Create state for the logged-in user
  const [sessionUser, setSessionUser] = React.useState({
    name: 'Loading...',
    email: '...',
    avatar: '',
  })

  // 3. Fetch the active user from Supabase when the sidebar loads
  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user && user.email) {
        setSessionUser({
          name: user.email.split('@')[0], // Uses the part before @ as the name
          email: user.email,
          avatar: '', // Shadcn will generate initials automatically
        })
      }
    }

    fetchUser()
  }, [])

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:p-1.5!'
            >
              <a href='#'>
                <CommandIcon className='size-5!' />
                <span className='text-base font-semibold'>WSAT</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        {/* 4. Pass the dynamic sessionUser instead of the static data.user */}
        <NavUser user={sessionUser} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  )
}
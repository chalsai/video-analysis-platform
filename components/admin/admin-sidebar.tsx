"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileVideo,
  Settings,
  BarChart3,
  ShieldCheck,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { name: "Videos", href: "/admin/videos", icon: FileVideo },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Security", href: "/admin/security", icon: ShieldCheck },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Help", href: "/admin/help", icon: HelpCircle },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 z-10 hidden w-64 bg-card border-r pt-16 md:flex md:flex-col">
      <div className="flex flex-grow flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
              )}
            >
              <item.icon
                className={cn(
                  pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  "mr-3 h-5 w-5 flex-shrink-0",
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

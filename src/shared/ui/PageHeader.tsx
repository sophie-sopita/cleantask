"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from './Button'

interface TabItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  brand?: string
  tabs?: TabItem[]
  actionLabel?: string
  actionHref?: string
}

export function PageHeader({
  title,
  subtitle,
  brand = 'CT',
  tabs = [],
  actionLabel,
  actionHref
}: PageHeaderProps) {
  const pathname = usePathname()

  return (
    <div className="mb-6">
      {/* Barra superior con gradiente */}
      <div className="rounded-t-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-orange-400 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              {/* Marca */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-semibold">
                  {brand}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold leading-tight">{title}</h1>
                  {subtitle && (
                    <p className="text-white/80 text-sm">{subtitle}</p>
                  )}
                </div>
              </div>

              {/* Acción primaria */}
              {actionLabel && actionHref && (
                <Link href={actionHref} className="hidden sm:block">
                  <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                    + {actionLabel}
                  </Button>
                </Link>
              )}
            </div>

            {/* Tabs de navegación */}
            {tabs.length > 0 && (
              <div className="mt-5 flex items-center gap-2 flex-wrap">
                {tabs.map((tab) => {
                  const active = pathname === tab.href
                  return (
                    <Link key={tab.href} href={tab.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {tab.icon && <span className="text-lg">{tab.icon}</span>}
                      {tab.label}
                    </Link>
                  )
                })}

                {/* Acción primaria en móvil */}
                {actionLabel && actionHref && (
                  <Link href={actionHref} className="sm:hidden">
                    <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                      + {actionLabel}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader
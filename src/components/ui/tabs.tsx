"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-start space-x-1 relative",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      "relative z-10",
      // Gradient background for active tab, subtle for inactive
      "bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400",
      "bg-clip-text text-transparent",
      "dark:hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-blue-500",
      // Active state: solid gradient bg, white text
      "data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:via-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-purple-400 data-[state=active]:shadow-lg",
      // Underline effect
      "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:scale-x-0 after:bg-gradient-to-r after:from-pink-400 after:via-purple-400 after:to-blue-400 after:transition-transform after:duration-300 hover:after:scale-x-100",
      "data-[state=active]:after:scale-x-100",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 focus-visible:outline-none",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }


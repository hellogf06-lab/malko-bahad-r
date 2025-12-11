import * as React from "react"
import { Controller } from "react-hook-form"
import { cn } from "../../lib/utils"

const Form = ({ children, onSubmit, className, ...rest }) => {
  // Sadece geçerli HTML props'larını aktar
  return (
    <form onSubmit={onSubmit} className={className} {...rest}>
      {children}
    </form>
  );
}

const FormField = ({ control, name, render }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => render({ field, fieldState })}
    />
  )
}

const FormItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
))
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium text-gray-700", className)}
    {...props}
  />
))
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} {...props} />
))
FormControl.displayName = "FormControl"

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-medium text-red-500", className)}
    {...props}
  >
    {children}
  </p>
))
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
}

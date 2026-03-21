"use client"

import {authService} from "@/api/service/auth.service"
import {Button} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {signUpSchema} from "@/pages/auths/schema"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import toast from "react-hot-toast"
import {z} from "zod"
// 👆 adjust path based on where your schema lives

const SignUp1 = signUpSchema.pick({
  fullname: true,
  email: true,
  password: true,
  confirmPassword: true,
})

type SignUp = z.infer<typeof SignUp1>

// Initialize API Client with configuration


// Initialize Auth Service with API Client

export default function SignUpForm() {
  const form = useForm<SignUp>({
    resolver: zodResolver(SignUp1),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

 const{register,control,formState:{errors},handleSubmit,watch} = form


  const onSubmit = async (data: SignUp) => {
    try {
      const response = await authService.register({
        fullname: data.fullname,
        email: data.email,
        password: data.password,
      })
      toast.success(response.message)
      // TODO: Handle success - redirect, etc.
    } catch (error: unknown) {
      console.error("Registration failed:", error)
      // Error toast is already handled by the global error handler
    }
  }

  return (
    <Form {...form}>
        <h1 className="text-4xl font-semibold my-4">Register </h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="bg-primary-venato text-white w-full cursor-pointer" >
          Sign Up
        </Button>

        {/* Divider */}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t">
          <span className="bg-background relative z-10 px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        {/* Social buttons */}
        <div className="grid gap-2 sm:grid-cols-3">
          <Button variant="outline" type="button" className="bg-primary-venato text-white">
            {/* Google logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="mr-2 h-4 w-4 cursor-pointer"
            >
              <path
                fill="#4285F4"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.53 2.53 29.93 0 24 0 14.62 0 6.44 5.38 2.57 13.22l7.98 6.2C12.38 13.62 17.74 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.1 24.5c0-1.62-.15-3.18-.43-4.68H24v9.01h12.45c-.54 2.94-2.18 5.44-4.65 7.12l7.41 5.73C43.3 37.07 46.1 31.23 46.1 24.5z"
              />
              <path
                fill="#FBBC05"
                d="M10.55 28.42c-.48-1.43-.75-2.95-.75-4.52s.27-3.09.75-4.52l-7.98-6.2C.92 16.17 0 20 0 23.9c0 3.9.92 7.73 2.57 11.12l7.98-6.2z"
              />
              <path
                fill="#EA4335"
                d="M24 47.8c6.48 0 11.9-2.13 15.87-5.8l-7.41-5.73c-2.07 1.39-4.73 2.2-8.46 2.2-6.26 0-11.62-4.12-13.45-9.72l-7.98 6.2C6.44 42.62 14.62 47.8 24 47.8z"
              />
            </svg>
            Google
          </Button>

          <Button variant="outline" type="button" className="bg-primary-venato text-white">
            {/* Twitter logo */}
           <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  className="mr-2 h-4 w-4 cursor-pointer"
  fill="currentColor"
>
  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48
           4.48 0 0 0 22.4 1c-.87.52-1.84.9-2.87
           1.1A4.52 4.52 0 0 0 16.5 0c-2.63 0-4.77
           2.14-4.77 4.77 0 .37.04.73.12 1.07A12.88
           12.88 0 0 1 3.15.67a4.77 4.77 0 0 0
           1.48 6.36 4.52 4.52 0 0 1-2.16-.6v.06c0
           2.23 1.59 4.09 3.7 4.51a4.54 4.54 0 0
           1-2.15.08 4.77 4.77 0 0 0 4.45 3.3A9.06
           9.06 0 0 1 2 19.54a12.77 12.77 0 0 0
           6.92 2.02c8.3 0 12.84-6.87
           12.84-12.84 0-.2 0-.39-.01-.58A9.22
           9.22 0 0 0 23 3z"/>
</svg>

            Twitter
          </Button>

          <Button variant="outline" type="button" className="bg-primary-venato text-white">
            {/* Facebook logo */}
          <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  className="mr-2 h-4 w-4 cursor-pointer"
  fill="currentColor"
>
  <path d="M22.675 0h-21.35C.596 0 0
           .596 0 1.325v21.351C0 23.404.596
           24 1.325 24h11.495v-9.294H9.691V11.01h3.129V8.413c0-3.1
           1.893-4.788 4.659-4.788 1.325 0
           2.464.099 2.796.143v3.24l-1.918.001c-1.504
           0-1.796.715-1.796 1.764v2.309h3.587l-.467
           3.696h-3.12V24h6.116C23.404 24
           24 23.404 24 22.676V1.325C24
           .596 23.404 0 22.675 0z"/>
</svg>

            Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}

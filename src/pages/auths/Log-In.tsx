import LoginForm2 from '@/components/ui/login-form2'
import { images } from '@/assets/images'

export default function Login() {
  return (
   <div className="w-full  items-center lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-screen ">
      {/* Right side with image */}
      <div className="hidden bg-muted lg:block">
        <img
          src={images.agric}
          alt="Login side"
          className="h-full w-full object-cover"
        />
      </div>
        {/* Left side with form */}
      <div className="flex items-center justify-center py-5">
        <div className="mx-auto grid w-[350px] gap-6 ">
          <LoginForm2 />
        </div>
      </div>
    </div>
  )
}


import { images } from '@/assets/images'
import SignUpForm from '@/components/ui/signin-form'

export default function SignUp() {
  return (
   <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-screen ">
      {/* Right side with image */}
      <div className="hidden bg-muted lg:block">
        <img
          src={images.onboarding}
          alt="Login side"
          className="h-full w-full object-cover"
        />
      </div>
        {/* Left side with form */}
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6 ">
            <SignUpForm/>
        </div>
      </div>
    </div>
  )
}

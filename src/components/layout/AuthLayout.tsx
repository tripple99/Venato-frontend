import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
    // Hardcoded configuration since settings store is ignored as per user request
    const loginPageConfig = {
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070",
        welcomeText: "Welcome to Venato",
        subtitle: "Experience the next generation of asset management and tracking."
    };

    return (
        <section className="flex h-screen overflow-hidden bg-white dark:bg-transparent">
            <div className="w-full px-0 py-0 md:py-0 h-full overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-full">
                    {/* Left Side - Background Image Placeholder (40% width) */}
                    <div className={`hidden lg:flex lg:w-[40%] rounded-sm overflow-hidden bg-cover bg-right`} style={{ backgroundImage: `url(${loginPageConfig.imageUrl})` }}>
                        <div className="relative w-full h-full flex flex-col items-center justify-center p-12 text-center bg-black/20 backdrop-blur-[2px]">
                            <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">{loginPageConfig.welcomeText}</h2>
                            <p className="text-lg text-white/90 max-w-md drop-shadow-md">
                                {loginPageConfig.subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Form Content (60% width on desktop, full width on mobile) */}
                    <div className="flex-1 lg:w-[60%] flex flex-col items-center justify-center overflow-y-auto relative">
                        <div className="w-full px-4 sm:px-8 max-w-xl">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

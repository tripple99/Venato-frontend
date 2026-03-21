import React from "react";
import { Github, Facebook, Twitter } from "lucide-react";


const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-venato text-white">
      <div className="container p-6 mx-auto ">
        <div className="lg:flex">
          {/* Left Section */}
          <div className="w-full -mx-6 lg:w-2/5">
            <div className="px-6">
              <a href="/" className="text-4xl">
               Venato
              </a>

              <p className="max-w-sm mt-2 ">
                Join Venato today and never miss out on new tools, tutorials, and
                insights.
              </p>

              {/* Social Links */}
              <div className="flex mt-6 ">
                <a
                  href="#"
                  className="mx-2transition-colors duration-300 dark:text-gray-300 hover:text-primary_elra"
                  aria-label="Reddit"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="mx-2 transition-colors duration-300 hover:text-primary_elra"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="mx-2 transition-colors duration-300 hover:text-primary_elra"
                  aria-label="Github"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="mt-6 lg:mt-0 lg:flex-1">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div>
                <h3 className=" uppercase dark:text-white">About</h3>
                <a href="#" className="block mt-2 text-sm hover:underline">
                  Company
                </a>
                <a href="#" className="block mt-2 text-sm   hover:underline">
                  Community
                </a>
                <a href="#" className="block mt-2 text-smhover:underline">
                  Careers
                </a>
              </div>

              {/* <div>
                <h3 className="uppercase dark:text-white">Blog</h3>
                <a href="#" className="block mt-2 text-sm  hover:underline">
                  Tech
                </a>
                <a href="#" className="block mt-2 text-sm  hover:underline">
                  Music
                </a>
                <a href="#" className="block mt-2 text-sm  hover:underline">
                  Videos
                </a>
              </div> */}

              <div>
                <h3 className=" uppercase dark:text-white">Products</h3>
                <a href="#" className="block mt-2 text-sm hover:underline">
                  Mega Cloud
                </a>
                <a href="#" className="block mt-2 text-smhover:underline">
                  Aperion UI
                </a>
                <a href="#" className="block mt-2 text-smhover:underline">
                  Venato Tools
                </a>
              </div>

              <div>
                <h3 className=" uppercase dark:text-white">Contact</h3>
                <span className="block mt-2 text-sm">
                  +234 800 123 4567
                </span>
                <span className="block mt-2 text-sm">
                  support@venato.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <hr className="h-px my-10" />

        <div>
          <p className="text-center">
            © {new Date().getFullYear()} Venato — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

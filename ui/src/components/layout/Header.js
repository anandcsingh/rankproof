import Image from 'next/image';
import Link from 'next/link'

const Header = () => {
  
    return (
               <nav className="bg-gray-800">
  <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div className="relative flex h-16 items-center justify-between">
      <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
       
        <button type="button" className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
       
          <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          
          <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div className="flex flex-shrink-0 items-center">
        <Link href="/">
                    
        <Image className="block h-8 w-auto lg:hidden"
                src="/assets/ma-logo.png"
                alt="RankProof"
                width="191"
                height="174"
                priority
              />
              </Link>
        <Link href="/">
              <Image className="hidden h-8 w-auto lg:block"
                src="/assets/ma-logo.png"
                alt="RankProof"
                width="191"
                height="174"
                priority
              />
              </Link>

          </div>
        <div className="hidden sm:ml-6 sm:block">
          <div className="flex space-x-4">
          <Link href="/dashboard" className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium">Dashboard</Link>
          <Link href="/add" className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium">Add</Link>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Students</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Lineage</a>
          </div>
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <button type="button" className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="sr-only">View notifications</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </button>

        <div className="relative ml-3">
          <div>
            <button type="button" className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
              <span className="sr-only">Open user menu</span>
              <Image height="32" width="32" className="h-8 w-8 rounded-full bg-white" src="https://robohash.org/B62qmdQVgKWmWWxtNpfjdx9wUp6fm1eUsBrK4V3PXjm4bFBvDTK5U3U" alt="" />
            </button>
          </div>

         
        </div>
      </div>
    </div>
  </div>

 <div className="sm:hidden" id="mobile-menu">
    <div className="space-y-1 px-2 pb-3 pt-2">
    <Link href="/dashboard" className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium">Dashboard</Link>
    <Link href="/add" className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium">Add</Link>
    
      <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Students</a>
      <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Lineage</a>
    </div>
  </div>
</nav>

     
    );
  }
  
  export default Header;
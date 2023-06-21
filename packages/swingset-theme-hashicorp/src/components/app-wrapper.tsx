'use client'
import { SideNavigation } from './side-nav'
import { categories } from 'swingset/meta'
import { useState } from 'react';
import { cx } from 'class-variance-authority'



export function AppWrapper({ children }: any) {

 const [isOpen, setIsOpen] = useState<boolean>(true);
 const toggle = () => setIsOpen((curr) => !curr)



 return (
  <>
   <SideNavigation categories={categories} isOpen={isOpen} toggle={toggle} />
   <main className={cx("ss-py-10 ss-flex ss-flex-col ss-flex-grow ss-h-full ss-transition-all", isOpen && "lg:ss-mx-96")}>
    <div className="ss-px-4 sm:ss-px-6 lg:ss-px-8 ss-flex ss-flex-col ss-flex-grow">
     {children}
    </div>
   </main>
  </>
 )
}

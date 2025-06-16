import { cn } from '@/lib/utils'
import React from 'react'

const GridBackgroundContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex w-full items-center justify-center bg-white dark:bg-black">
      <div
       className={cn(
        "absolute inset-0",
        "[background-size:30px_30px]",
        "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
        "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
      )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
{/* <RandomFloatingIcons /> */}
{/* removed because not looking good */}

      {children}
    </div>
  );
};

export default GridBackgroundContainer;

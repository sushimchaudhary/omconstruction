"use client"
import DownloadApp from '@/components/landing/Download'
import ServicesSection from '@/components/landing/services';
import React from 'react'

const page = () => {
  const handleInstallClick = () => {
    // Add your PWA install prompt handler logic here
  };

  return (
    <div>
        <ServicesSection/>
      <DownloadApp 
        isInstallable={true} 
        onInstallClick={handleInstallClick} 
      />
    </div>
  )
}

export default page
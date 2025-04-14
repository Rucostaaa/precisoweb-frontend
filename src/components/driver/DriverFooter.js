import React from 'react'
import { Link } from 'react-router-dom'
import Switch from "../designLayouts/Switch"

const DriverFooter = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-blue-500 to-indigo-700 py-1 px-[50px] flex items-center justify-between shadow-lg text-white">
        <Link to="/driver/services" className="text-lg font-semibold hover:text-yellow-300 transition-colors">Serviços</Link>
        <Switch />

        <Link to="/driver/settings" className="text-lg font-semibold hover:text-yellow-300 transition-colors">Definições</Link>
    </div>
  )
}

export default DriverFooter

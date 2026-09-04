import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

export default function DashboardLayout({ onLogout }) {
  const location = useLocation()

  return (
    <div className="app-layout">
      <Sidebar onLogout={onLogout} />
      <div className="app-main">
        <Header />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            className="app-content"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}

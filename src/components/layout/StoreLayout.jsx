import { Outlet } from 'react-router-dom'
import StoreHeader from './StoreHeader'
import StoreFooter from './StoreFooter'
import '../../styles/store.css'

export default function StoreLayout() {
  return (
    <div className="store-zone">
      <div className="store-layout">
        <StoreHeader />
        <main className="store-main">
          <Outlet />
        </main>
        <StoreFooter />
      </div>
    </div>
  )
}

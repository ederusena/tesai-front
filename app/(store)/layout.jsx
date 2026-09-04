import StoreHeader from '../../src/components/layout/StoreHeader'
import StoreFooter from '../../src/components/layout/StoreFooter'
import '../../src/styles/store.css'

export default function StoreLayout({ children }) {
  return (
    <div className="store-zone">
      <div className="store-layout">
        <StoreHeader />
        <main className="store-main">
          {children}
        </main>
        <StoreFooter />
      </div>
    </div>
  )
}

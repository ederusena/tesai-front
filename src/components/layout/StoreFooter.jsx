import { PlusCircle, MessageCircle, Send, ShieldCheck, MapPin } from 'lucide-react'

const WHATSAPP_ADMIN = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545991562811'

export default function StoreFooter() {
  const waLink = `https://wa.me/${WHATSAPP_ADMIN.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Gostaria de tirar dúvidas com o farmacêutico de plantão.')}`

  return (
    <footer className="store-footer" style={{ background: '#0a3d62', color: '#fff', padding: '48px 0 24px', marginTop: 60 }}>
      <div className="store-container">
        <div className="store-footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
          {/* Brand */}
          <div>
            <div className="store-footer-brand" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div className="store-footer-brand-icon" style={{ background: '#0077b6', color: '#fff', padding: 6, borderRadius: 8 }}>
                <PlusCircle size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Tesãi</span>
            </div>
            <p className="store-footer-desc" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Sua farmácia e importadora de confiança em Ciudad del Este (Paraguai).
              Linha especializada, medicamentos de procedência e soluções injetáveis com envio seguro para o Brasil.
            </p>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#68d8d6', fontSize: '0.8rem' }}>
              <MapPin size={16} />
              <span>Av. Adrián Jara c/ Curupayty — Ciudad del Este</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: 16 }}>Departamentos</h4>
            <ul className="store-footer-links" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><a href="/loja?category=tirzepatida-tirzec" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem' }}>Linha Tirzepatida • Tirzec</a></li>
              <li><a href="/loja?category=tirzepatida-outras" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem' }}>Tirzepatida Outras Linhas</a></li>
              <li><a href="/loja?category=semaglutida" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem' }}>Linha Semaglutida</a></li>
              <li><a href="/loja" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem' }}>Catálogo Completo</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: 16 }}>Segurança & Envio</h4>
            <ul className="store-footer-links" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><a href="/suporte" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem' }}>Rastrear Meu Pedido</a></li>
              <li><a href="/suporte" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem' }}>Como Funciona o Envio CDE → Brasil</a></li>
              <li><a href="/suporte" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem' }}>Garantia e Procedência</a></li>
              <li><a href="/suporte" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem' }}>Dúvidas Frequentes</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: 16 }}>Atendimento</h4>
            <ul className="store-footer-links" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#25D366',
                    color: '#fff',
                    padding: '8px 14px',
                    borderRadius: 6,
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                  }}
                >
                  <MessageCircle size={16} /> WhatsApp de Vendas
                </a>
              </li>
              <li style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginTop: 6 }}>
                📧 contato@tesai.com
              </li>
              <li style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                Seg à Sex: 07:00 às 18:00 (PY/BR)
              </li>
            </ul>
          </div>
        </div>

        <div className="store-footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 40, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
            © {new Date().getFullYear()} Tesãi. Todos os direitos reservados.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#68d8d6', fontSize: '0.75rem' }}>
            <ShieldCheck size={16} />
            <span>Compra Segura & Envio Protegido com Código de Rastreio</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

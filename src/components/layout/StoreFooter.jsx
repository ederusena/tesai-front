import { MessageCircle, ShieldCheck, Truck, Lock, CreditCard, Award } from 'lucide-react'

const WHATSAPP_ADMIN = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545991562811'

export default function StoreFooter() {
  const waLink = `https://wa.me/${WHATSAPP_ADMIN.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Gostaria de falar com o farmacêutico responsável da Tesãi.')}`

  return (
    <footer className="di-footer">
      {/* 1. Newsletter Row */}
      <div className="di-newsletter-row">
        <div className="store-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 4px', color: '#FFF' }}>
              Receba novidades e ofertas exclusivas em primeira mão
            </h3>
            <p style={{ margin: 0, color: '#E9D5FF', fontSize: '0.88rem' }}>
              Cadastre-se para receber atualizações de estoque da linha Tirzepatida e Semaglutida
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, flex: 1, maxWidth: 460 }}>
            <input 
              type="email" 
              placeholder="Digite seu melhor e-mail" 
              style={{ flex: 1, padding: '12px 18px', borderRadius: 999, border: 'none', outline: 'none', fontSize: '0.9rem' }}
            />
            <button style={{ background: '#FDE047', color: '#1F2937', fontWeight: 800, border: 'none', padding: '12px 24px', borderRadius: 999, cursor: 'pointer', fontSize: '0.88rem' }}>
              Cadastrar
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Institutional Footer (Drogaria Iguatemi style) */}
      <div className="store-container di-footer-main">
        <div className="di-footer-grid">
          {/* Col 1: Brand & Bio */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: '#4A1D96', color: '#FFF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                T
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4A1D96' }}>Tesãi</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#6B7280', lineHeight: 1.6, marginBottom: 16 }}>
              A <strong>Tesãi Farmácias</strong> é referência em soluções injetáveis e medicamentos de alta especialidade em Ciudad del Este (Paraguai), oferecendo logística segura com controle térmico para todo o Brasil.
            </p>
            <a 
              href={waLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25D366', color: '#FFF', padding: '10px 18px', borderRadius: 6, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}
            >
              <MessageCircle size={18} /> Central WhatsApp
            </a>
          </div>

          {/* Col 2: Departamentos */}
          <div className="di-footer-col">
            <h4>Departamentos</h4>
            <ul>
              <li><a href="/loja?category=tirzepatida-tirzec">Linha Tirzec</a></li>
              <li><a href="/loja?brand=TG">Linha TG Injetáveis</a></li>
              <li><a href="/loja?brand=Lipoless">Linha Lipoless & Lipoland</a></li>
              <li><a href="/loja?category=semaglutida">Linha Semaglutida</a></li>
              <li><a href="/loja">Catálogo Completo</a></li>
            </ul>
          </div>

          {/* Col 3: Institucional */}
          <div className="di-footer-col">
            <h4>Institucional</h4>
            <ul>
              <li><a href="/suporte">Nossa História</a></li>
              <li><a href="/suporte">Procedência & Autenticidade</a></li>
              <li><a href="/suporte">Controle Térmico de Envio</a></li>
              <li><a href="/suporte">Política de Privacidade</a></li>
              <li><a href="/suporte">Termos de Compra</a></li>
            </ul>
          </div>

          {/* Col 4: Atendimento & Rastreio */}
          <div className="di-footer-col">
            <h4>Atendimento</h4>
            <ul>
              <li><a href="/suporte">Rastrear Meu Pedido</a></li>
              <li><a href="/suporte">Dúvidas Frequentes (FAQ)</a></li>
              <li><a href="/suporte">Como Comprar no Site</a></li>
              <li><a href="/suporte">Garantia de Entrega</a></li>
              <li><a href="/suporte">Trocas e Devoluções</a></li>
            </ul>
          </div>

          {/* Col 5: Formas de Pagamento & Segurança */}
          <div className="di-footer-col">
            <h4>Segurança</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#065F46', background: '#ECFDF5', padding: '6px 10px', borderRadius: 4 }}>
                <ShieldCheck size={16} /> Compra 100% Protegida
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#1E40AF', background: '#EFF6FF', padding: '6px 10px', borderRadius: 4 }}>
                <Lock size={16} /> SSL 256-Bit Criptografado
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#92400E', background: '#FEF3C7', padding: '6px 10px', borderRadius: 4 }}>
                <Award size={16} /> Lacre de Fábrica Original
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer Bottom Disclaimer */}
      <div className="di-footer-bottom">
        <div className="store-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
            <div>
              <strong>Formas de Pagamento Aceitas:</strong> Pix (à vista com desconto), Cartão de Crédito (em até 6x sem juros), Boleto Bancário.
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <span>© {new Date().getFullYear()} TESÃI FARMÁCIAS & IMPORTAÇÕES. Todos os direitos reservados.</span>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '0.72rem', color: '#9CA3AF', lineHeight: 1.5 }}>
            A Tesãi Farmácias atua em conformidade com as diretrizes de boas práticas farmacêuticas e procedência de Ciudad del Este (PY). Medicamentos sob prescrição médica devem ser acompanhados por orientação profissional. As informações contidas neste site têm caráter exclusivamente informativo.
          </p>
        </div>
      </div>
    </footer>
  )
}

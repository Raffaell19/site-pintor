/**
 * Machado Pinturas - Interações da Landing Page
 * JavaScript Vanilla Puro, Leve e de Alta Performance
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuração Principal (Personalizável para o WhatsApp da Empresa)
  const WHATSAPP_PHONE = '5511999999999'; // Formato: DDI + DDD + Número sem espaços ou traços

  /* ==========================================================
     1. MODAL DE TRIAGEM RÁPIDA DE WHATSAPP (1-CLIQUE)
     ========================================================== */
  const triageModal = document.getElementById('triageModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const serviceOptionsContainer = document.getElementById('serviceOptions');
  const clientNameInput = document.getElementById('clientName');
  const clientLocationInput = document.getElementById('clientLocation');
  const submitWhatsappBtn = document.getElementById('submitWhatsappBtn');
  const openModalButtons = document.querySelectorAll('.open-triage-modal');

  let selectedService = 'Pintura Residencial Interna';

  // Função para abrir o modal
  function openModal(defaultService = null) {
    if (defaultService && defaultService !== 'Geral') {
      selectedService = defaultService;
      // Atualizar chips ativos
      const chips = serviceOptionsContainer.querySelectorAll('.chip');
      let found = false;
      chips.forEach(chip => {
        if (chip.dataset.value.toLowerCase().includes(defaultService.toLowerCase()) || 
            defaultService.toLowerCase().includes(chip.dataset.value.toLowerCase())) {
          chip.classList.add('active');
          found = true;
        } else {
          chip.classList.remove('active');
        }
      });
      if (!found && chips.length > 0) {
        chips[0].classList.add('active');
        selectedService = chips[0].dataset.value;
      }
    }

    triageModal.classList.add('active');
    triageModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Impede scroll ao fundo
  }

  // Função para fechar o modal
  function closeModal() {
    triageModal.classList.remove('active');
    triageModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Event Listeners dos botões de abertura
  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || 'Pintura Residencial Interna';
      openModal(service);
      const navMenu = document.getElementById('navMenu');
      const mobileToggle = document.getElementById('mobileToggle');
      if (navMenu && mobileToggle) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
      }
    });
  });

  // Fechar no clique do X
  modalCloseBtn.addEventListener('click', closeModal);

  // Fechar ao clicar fora do card
  triageModal.addEventListener('click', (e) => {
    if (e.target === triageModal) {
      closeModal();
    }
  });

  // Fechar com a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && triageModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Seleção de Chips de Serviço no Modal
  if (serviceOptionsContainer) {
    const chips = serviceOptionsContainer.querySelectorAll('.chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedService = chip.getAttribute('data-value');
      });
    });
  }

  // Disparo Inteligente para o WhatsApp
  submitWhatsappBtn.addEventListener('click', () => {
    const name = clientNameInput.value.trim();
    const location = clientLocationInput.value.trim();

    let message = `Olá Machado Pinturas! Gostaria de um orçamento para *${selectedService}*.`;

    if (name) {
      message = `Olá Machado Pinturas! Meu nome é *${name}* e gostaria de um orçamento para *${selectedService}*.`;
    }

    if (location) {
      message += ` O imóvel fica na região de: *${location}*.`;
    }

    message += ` Como podemos prosseguir?`;

    // Montar URL do WhatsApp com a mensagem codificada
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    
    // Abrir em nova aba
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Fechar o modal após redirecionamento
    setTimeout(closeModal, 400);
  });


  /* ==========================================================
     2. ACCORDION DE PERGUNTAS FREQUENTES (FAQ)
     ========================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha todos os outros itens
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        otherAnswer.style.maxHeight = null;
      });

      // Alterna o item atual
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });


  /* ==========================================================
     3. MENU MOBILE & NAVEGAÇÃO SUAVE
     ========================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });

    // Fechar menu mobile ao clicar em um link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
      });
    });
  }


  /* ==========================================================
     4. ANIMAÇÃO DE CONTAGEM DAS ESTATÍSTICAS
     ========================================================== */
  const statsElements = document.querySelectorAll('.stat-value');
  let animatedStats = false;

  const statsSection = document.querySelector('.stats-counter-section');

  if (statsSection && statsElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          animatedStats = true;
          statsElements.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const originalText = el.innerText;
            const hasPlus = originalText.includes('+');
            const hasPercent = originalText.includes('%');
            
            let current = 0;
            const duration = 1800; // 1.8 segundos
            const increment = Math.ceil(target / (duration / 25));

            const counter = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(counter);
                el.innerText = `${current}${hasPlus ? '+' : ''}${hasPercent ? '%' : ''}`;
              } else {
                el.innerText = `${current}${hasPlus ? '+' : ''}${hasPercent ? '%' : ''}`;
              }
            }, 25);
          });
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }


  /* ==========================================================
     5. HEADER ELEVATION NO SCROLL
     ========================================================== */
  const mainHeader = document.getElementById('mainHeader');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader.style.boxShadow = '0 10px 30px -10px rgba(11, 19, 43, 0.12)';
      mainHeader.style.borderBottomColor = 'rgba(226, 232, 240, 0.6)';
    } else {
      mainHeader.style.boxShadow = 'none';
      mainHeader.style.borderBottomColor = '#E2E8F0';
    }
  }, { passive: true });
});

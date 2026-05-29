// ==========================================
// CONFIGURAÇÃO DO GOOGLE SHEETS
// ==========================================
// TODO: Cole aqui a URL que você copiou da imagem (App da Web)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxgvMgilpqT3gC1pnZNfGzYzSFOAVGTtEBxcY_BcHPHsdtTyaygphkmXjQ5AqBR4JGEhg/exec";

// LISTA OFICIAL DE CONVIDADOS (Mantenha todos aqui)
const allowedNames = [
    "Ademir Cosme de Azevedo",
    "Eliza Gomes de Azevedo",
    "Milene Gomes Azevedo",
    "Mikael Gabriel de Lima Oliveira",
    "Elizabeth Nascimento",
    "Aline Nascimento Costa",
    "Miriam Gomes",
    "Amarildo Araujo",
    "Fernanda Gomes Araujo",
    "Felipe Mendes",
    "Erli Gomes Nascimento",
    "Tatiana Sobreira",
    "Marcio Nascimento",
    "Nayara Nascimento",
    "Angela Otani",
    "Ivonete Gomes Muller",
    "Elizeu Muller",
    "Elias Nascimento",
    "Juvenilia Gomes do Nascimento",
    "Valdomiro Alves do Nascimento",
    "Maria do Prado",
    "Marcia Gomes",
    "Sophia Gomes",
    "José Leonardo",
    "Rafael Faleta",
    "Rafael Otani",
    "Nicole",
    "José Nascimento",
    "Aécio Mendonça",
    "Alessandra Abe",
    "Fernanda Kimie Kinshoku",
    "Alexandre Kazuo",
    "Juliana Maia",
    "Pietro Maia",
    "Daniel Ken Maia",
    "Ana Lucia Abe",
    "Auderita Galvão Abe",
    "Olimpia Kinshoku",
    "Katsushigue Kinshoku",
    "Andrea Kinshoku",
    "Marcelo",
    "Richard Hideki",
    "Sthefany Saori",
    "Humberto Kinshoku",
    "Mônica",
    "Enzo Camargo",
    "Ramon Diaz",
    "Helena Diaz Abe",
    "Andrea Luri Abe",
    "Marina Domeneghete",
    "Sophia Maffei",
    "Luiza Martins",
    "Felipe Amaral",
    "Guilherme Chamusca",
    "Fernanda Pinheiro",
    "Matheus Batists",
    "Bruno Freitas",
    "Matheus Pádua",
    "Gustavo Correa",
    "Clara Vieitas",
    "Fabrizzia Milano",
    "Guilherme Abreu",
    "Lucas Saad",
    "Lucas Nobrega",
    "Henrique Bubblitz",
    "Leonardo Correa",
    "Kamule Wakid",
    "Giovana Contieri",
    "Lis Donadelli",
    "Thuany Diaz",
    "Natasha Monassa",
    "Luna Donadelli",
    "Tamires Nascimento",
    "Henrique Abreu",
    "Mudd Serhan",
    "Omar Serhan",
    "Beatriz Marianna",
    "Gabriel Simões",
    "Isabela Moreira",
    "Natália Santos",
    "Manuella Monassa",
  // Adicione os demais convidados aqui...
];

// Objeto para armazenar o status real de RSVP vindo do Google Sheets
const guestRsvpStatus = {};

// ==========================================
// INICIALIZAÇÃO E CARREGAMENTO DO PAINEL SECRETO
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    // Ativa imediatamente a lógica de sugestão de nomes (sem esperar o Google)
    inicializarSugestoesNome();

    // VERIFICAÇÃO DO LINK SECRETO: seosite.com/?acesso=noivos
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('acesso') === 'noivos') {
        // Modifica o clique do botão "CONFIRMAR" do menu para abrir o painel secreto
        const menuConfirmar = document.querySelector('a[href="#confirmar"], a[href*="confirmar"]');
        if (menuConfirmar) {
            menuConfirmar.removeAttribute('href');
            menuConfirmar.style.cursor = 'pointer';
            menuConfirmar.addEventListener('click', (e) => {
                e.preventDefault();
                buscarDadosECarregarModal();
            });
        }
        
        // Abre o painel automaticamente ao carregar
        buscarDadosECarregarModal();
    }
});

// Função auxiliar que vai ao Google Sheets buscar os status apenas quando necessário
function buscarDadosECarregarModal() {
    // Exibe um aviso visual rápido ou abre o modal limpo enquanto carrega
    const modal = document.getElementById('rsvpStatusModal');
    if (modal) modal.style.display = 'flex';

    const listEl = document.getElementById('confirmedList');
    if (listEl) listEl.innerHTML = '<li>Carregando lista atualizada...</li>';

    fetch(WEB_APP_URL)
        .then(response => response.json())
        .then(data => {
            // Limpa o objeto de status antigo
            for (let prop in guestRsvpStatus) { delete guestRsvpStatus[prop]; }

            // Preenche o objeto com o que está na planilha atualmente
            data.forEach(item => {
                guestRsvpStatus[item.nome] = item.presenca.toLowerCase().trim();
            });

            // Atualiza o modal com as listas separadas
            renderizarListasNoModal();
        })
        .catch(err => {
            console.error("Erro ao buscar dados do Google Sheets:", err);
            document.getElementById('confirmedList').innerHTML = '<li>Erro ao carregar dados. Tente novamente.</li>';
        });
}

// ==========================================
// LÓGICA DE SUGESTÃO DE NOMES (RSVP)
// ==========================================
const nameInput = document.getElementById('f-nome');
const nameSuggestionsContainer = document.getElementById('name-suggestions');

function inicializarSugestoesNome() {
    if (nameInput && nameSuggestionsContainer) {
        nameInput.addEventListener('input', function() {
            const inputValue = this.value.trim();
            nameSuggestionsContainer.innerHTML = ''; 

            if (inputValue.length === 0) {
                nameSuggestionsContainer.style.display = 'none';
                return;
            }

            // Filtra direto da sua lista local do código
            const filteredNames = allowedNames.filter(name =>
                name.toLowerCase().includes(inputValue.toLowerCase())
            );

            if (filteredNames.length > 0) {
                nameSuggestionsContainer.style.display = 'block';
                filteredNames.forEach(name => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.classList.add('name-suggestions-item');
                    suggestionItem.textContent = name;
                    suggestionItem.addEventListener('click', function() {
                        nameInput.value = name;
                        nameSuggestionsContainer.innerHTML = '';
                        nameSuggestionsContainer.style.display = 'none';
                    });
                    nameSuggestionsContainer.appendChild(suggestionItem);
                });
            } else {
                nameSuggestionsContainer.style.display = 'none';
            }
        });

        document.addEventListener('click', function(event) {
            if (!nameInput.contains(event.target) && !nameSuggestionsContainer.contains(event.target)) {
                nameSuggestionsContainer.style.display = 'none';
            }
        });
    }
}

// ==========================================
// ENVIO DO RSVP (SALVA NO GOOGLE SHEETS)
// ==========================================
function submitRSVP() {
    const nome = nameInput.value.trim();
    if (!nome) { alert('Por favor, informe seu nome.'); return; }
    
    const radioPresenca = document.querySelector('input[name="presenca"]:checked');
    if (!radioPresenca) { alert('Por favor, selecione se vai comparecer ou não.'); return; }
    
    const statusPresenca = radioPresenca.value;
    
    // Valida estritamente contra a sua lista do código
    const foundName = allowedNames.find(allowed => allowed.toLowerCase() === nome.toLowerCase());
    if (!foundName) {
        alert('Seu nome não está na lista de convidados. Por favor, verifique a grafia ou entre em contato com os noivos.');
        return;
    }

    const btnSubmit = document.querySelector('.btn-submit') || document.querySelector('#rsvp-form button');
    const textoOriginalBotao = btnSubmit ? btnSubmit.textContent : "Confirmar";
    if (btnSubmit) {
        btnSubmit.textContent = "Enviando...";
        btnSubmit.disabled = true;
    }

    // Envia para a planilha do Google
    fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", 
        body: JSON.stringify({ nome: foundName, presenca: statusPresenca })
    })
    .then(() => {
        // Como o modo é 'no-cors', não podemos validar a resposta JSON, 
        // mas assumimos que o envio foi disparado.
        if (statusPresenca === 'sim') {
            document.getElementById('success-text').textContent = `Que alegria, ${foundName}! Presença confirmada.`;
            const smallText = document.querySelector('#success small');
            if (smallText) smallText.textContent = "Nos vemos em breve!";
        } else {
            document.getElementById('success-text').textContent = `Poxa, ${foundName}...`;
            const smallText = document.querySelector('#success small');
            if (smallText) smallText.textContent = "Sentiremos sua falta, mas obrigado por nos avisar!";
        }

        document.getElementById('success').style.display = 'block';
        document.getElementById('success').scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        const f = document.getElementById('rsvp-form');
        if (f) {
            f.style.opacity = '.3'; 
            f.style.pointerEvents = 'none';
        }
    })
    .catch(err => {
        console.error("Erro ao salvar RSVP:", err);
        alert("Ocorreu um erro ao salvar sua resposta. Por favor, tente novamente.");
        if (btnSubmit) {
            btnSubmit.textContent = textoOriginalBotao;
            btnSubmit.disabled = false;
        }
    });
}

// ==========================================
// PAGAMENTO (LÓGICA DO MODAL DE PRESENTES)
// ==========================================
function openPayment(name, price) {
    document.getElementById('modalGiftName').textContent = name;
    document.getElementById('modalGiftPrice').textContent = `Valor: R$ ${price}`;
    document.getElementById('paymentModal').style.display = 'flex';
    document.getElementById('pixArea').style.display = 'none'; 
    document.getElementById('paymentOptions').style.display = 'flex';
    document.getElementById('paymentText').style.display = 'block';

    const copyBtn = document.getElementById('copyPixBtn');
    if (copyBtn) {
        copyBtn.textContent = 'Copiar Chave PIX';
    }
}

function closePayment() {
    document.getElementById('paymentModal').style.display = 'none';
}

function showPix() {
    document.getElementById('pixArea').style.display = 'flex';
    document.getElementById('paymentOptions').style.display = 'none';
    document.getElementById('paymentText').style.display = 'none';
}

function copyPixKey() {
    const pixKey = '00020101021126330014br.gov.bcb.pix0111414371208305204000053039865802BR5920LARISSA DO N AZEVEDO6009SAO PAULO62070503***63048881'; 
    navigator.clipboard.writeText(pixKey).then(() => {
        const copyBtn = document.getElementById('copyPixBtn');
        if (copyBtn) {
            copyBtn.textContent = 'Chave copiada';
        }
    });
}

// ==========================================
// PROCESSAMENTO E RENDERIZAÇÃO DAS LISTAS DO PAINEL
// ==========================================
function renderizarListasNoModal() {
    const confirmedList = document.getElementById('confirmedList');
    const declinedList = document.getElementById('declinedList');
    const noResponseList = document.getElementById('noResponseList');

    confirmedList.innerHTML = '';
    declinedList.innerHTML = '';
    noResponseList.innerHTML = '';

    let simCount = 0;
    let naoCount = 0;
    let noResponseCountVal = 0;

    // Pega a sua lista fixa de nomes do código, organiza em ordem alfabética e distribui
    [...allowedNames].sort((a, b) => a.localeCompare(b)).forEach(name => {
        const status = guestRsvpStatus[name]; 
        const listItem = document.createElement('li');
        listItem.textContent = name;

        if (status === 'sim') {
            confirmedList.appendChild(listItem);
            simCount++;
        } else if (status === 'nao' || status === 'não') {
            declinedList.appendChild(listItem);
            naoCount++;
        } else {
            noResponseList.appendChild(listItem);
            noResponseCountVal++;
        }
    });

    const confirmedCount = document.getElementById('confirmedCount');
    const declinedCount = document.getElementById('declinedCount');
    const noResponseCount = document.getElementById('noResponseCount');

    if (confirmedCount) confirmedCount.textContent = simCount;
    if (declinedCount) declinedCount.textContent = naoCount;
    if (noResponseCount) noResponseCount.textContent = noResponseCountVal;
}

function closeRsvpStatusModal() {
    document.getElementById('rsvpStatusModal').style.display = 'none';
}

// ==========================================
// PÉTALAS FLUTUANTES COM COLISÃO
// ==========================================
(function initPetals() {
    const wrap = document.createElement('div');
    wrap.className = 'petals-wrap';
    document.body.appendChild(wrap);

    const colors = ['#f0ddd0', '#f5e4d6', '#f7e8dd'];
    const NUM = 16;
    const petals = [];

    for (let i = 0; i < NUM; i++) {
        const el = document.createElement('div');
        el.className = 'petal';
        const size = Math.random() * 9 + 6;
        el.style.width  = size + 'px';
        el.style.height = (size * 1.5) + 'px';
        el.style.background = colors[Math.floor(Math.random() * colors.length)];
        wrap.appendChild(el);

        petals.push({
            el, size,
            x:         Math.random() * window.innerWidth,
            y:        -Math.random() * window.innerHeight,
            vx:        (Math.random() - 0.5) * 0.4,
            vy:         Math.random() * 0.2 + 0.12,
            rot:        Math.random() * 360,
            rotSpeed:  (Math.random() - 0.5) * 1.4
        });
    }

    function animate() {
        petals.forEach(p => {
            p.x   += p.vx;
            p.y   += p.vy;
            p.rot += p.rotSpeed;

            if (p.y > window.innerHeight + 20) {
                p.y  = -20;
                p.x  = Math.random() * window.innerWidth;
                p.vx = (Math.random() - 0.5) * 0.4;
                p.vy = Math.random() * 0.2 + 0.12;
            }
            if (p.x < -20)                    p.x = window.innerWidth + 20;
            if (p.x > window.innerWidth + 20) p.x = -20;

            p.el.style.transform = `translate(${p.x}px,${p.y}px) rotate(${p.rot}deg)`;
        });

        requestAnimationFrame(animate);
    }

    animate();
})();

// ==========================================
// SCROLL REVEAL
// ==========================================
(function initReveal() {
    const selectors = [
        '.section-label', '.section-title', '.section-text',
        '.count-box', '.detail-card', '.gift-card',
        '.dress-code-item', '.rsvp-form'
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal');
            const siblings = Array.from(el.parentElement.querySelectorAll(selector));
            const idx = siblings.indexOf(el);
            if (idx > 0) el.style.transitionDelay = `${idx * 0.09}s`;
        });
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ==========================================
// CONTAGEM REGRESSIVA
// ==========================================
const targetDate = new Date("Aug 29, 2026 14:30:00").getTime();

const countdown = setInterval(function() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById("cd-days");
    const hrsEl = document.getElementById("cd-hrs");
    const minEl = document.getElementById("cd-min");
    const secEl = document.getElementById("cd-sec");

    if (daysEl) daysEl.textContent = days;
    if (hrsEl) hrsEl.textContent = hours;
    if (minEl) minEl.textContent = minutes;
    if (secEl) secEl.textContent = seconds;

    if (distance < 0) {
        clearInterval(countdown);
        const countdownGrid = document.querySelector('.count-grid');
        if (countdownGrid) countdownGrid.innerHTML = "<h3>Já chegou o grande dia!</h3>";
    }
}, 1000);

// ==========================================
// EVENTOS DE FECHAMENTO DOS MODAIS (CLICK FORA)
// ==========================================
window.addEventListener('click', function(event) {
    const rsvpModal = document.getElementById('rsvpStatusModal');
    const paymentModal = document.getElementById('paymentModal');
    
    if (event.target == rsvpModal) {
        closeRsvpStatusModal();
    }
    if (event.target == paymentModal) {
        closePayment();
    }
});
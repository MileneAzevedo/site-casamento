// Lista de nomes permitidos para confirmação
const allowedNames = [
  "Larissa Silva", // Exemplo
  "Lucas Pereira", // Exemplo
  "Maria Oliveira",
  "João Santos",
  "Ana Paula Costa",
  "Pedro Henrique Almeida",
  "Mariana Fernandes",
  "Carlos Eduardo Rocha"
  // Adicione todos os nomes dos convidados aqui
];

// Lógica de Sugestão de Nomes para RSVP
const nameInput = document.getElementById('f-nome');
const nameSuggestionsContainer = document.getElementById('name-suggestions');

if (nameInput) {
  nameInput.addEventListener('input', function() {
    const inputValue = this.value.trim();
    nameSuggestionsContainer.innerHTML = ''; // Limpa sugestões anteriores

    if (inputValue.length === 0) {
      nameSuggestionsContainer.style.display = 'none';
      return;
    }

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

  // Esconde as sugestões ao clicar fora do campo de input ou da lista de sugestões
  document.addEventListener('click', function(event) {
    if (!nameInput.contains(event.target) && !nameSuggestionsContainer.contains(event.target)) {
      nameSuggestionsContainer.style.display = 'none';
    }
  });
}

// RSVP
function submitRSVP() {
  const nome = nameInput.value.trim();
  if (!nome) { alert('Por favor, informe seu nome.'); return; }
  
  const foundName = allowedNames.find(allowed => allowed.toLowerCase() === nome.toLowerCase());
  if (!foundName) {
    alert('Seu nome não está na lista de convidados. Por favor, verifique ou entre em contato com os noivos.');
    return;
  }

  document.getElementById('success-text').textContent = `Que alegria, ${foundName}!`;
  document.getElementById('success').style.display = 'block';
  document.getElementById('success').scrollIntoView({ behavior: 'smooth', block: 'center' });
  const f = document.getElementById('rsvp-form');
  f.style.opacity = '.3'; 
  f.style.pointerEvents = 'none';
}

// PAGAMENTO (Lógica do Modal de Presentes)
function openPayment(name, price) {
  document.getElementById('modalGiftName').textContent = name;
  document.getElementById('modalGiftPrice').textContent = `Valor: R$ ${price}`;
  document.getElementById('paymentModal').style.display = 'flex';
  document.getElementById('pixArea').style.display = 'none'; // Garante que a área PIX comece escondida

  // Reseta o texto do botão PIX toda vez que o modal é aberto
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
}

function copyPixKey() {
  // A chave PIX real que será copiada.
  const pixKey = '123456'; 
  navigator.clipboard.writeText(pixKey).then(() => {
    const copyBtn = document.getElementById('copyPixBtn');
    if (copyBtn) {
      copyBtn.textContent = 'Chave copiada';
    }
  });
}

// Fecha o modal se o usuário clicar fora do conteúdo
window.onclick = function(event) {
  if (event.target == document.getElementById('paymentModal')) {
    closePayment();
  }
}

// CONTAGEM REGRESSIVA
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

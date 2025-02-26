document.addEventListener("DOMContentLoaded", () => {
  // URL do backend (altere para seu endereço real quando implantar)
  const API_URL = 'http://localhost:3000/api';

  // ======================
  // SEÇÃO: CARREGAR DADOS
  // ======================
  async function loadRankingData() {
    try {
      const response = await fetch(`${API_URL}/sales/ranking`);
      const data = await response.json();
      
      updateRankingUI(data);
    } catch (error) {
      console.error('Erro ao carregar dados de ranking:', error);
      alert('Erro ao carregar dados. Tente novamente mais tarde.');
    }
  }

  function updateRankingUI(data) {
    const { ranking, totalTime, totalPodium } = data;
    
    // Atualizar totais
    document.getElementById('total-time').textContent = totalTime;
    document.getElementById('total-top3').textContent = totalPodium;
    
    // Atualizar pódio se tiver pelo menos 3 vendedores
    if (ranking.length >= 3) {
      updatePodium(ranking[0], ranking[1], ranking[2]);
    }
    
    // Atualizar lista geral
    updateLeaderboardList(ranking);
  }

  function updatePodium(first, second, third) {
    // Primeiro lugar
    document.querySelector('.first-place h2').textContent = first.nome;
    document.querySelector('.first-place .score:nth-of-type(1)').textContent = 
      `Faturamento: ${first.faturamentoFormatado}`;
    document.querySelector('.first-place .score:nth-of-type(2)').textContent = 
      `Vendas: ${first.vendas}`;
    
    // Segundo lugar
    document.querySelector('.second-place h2').textContent = second.nome;
    document.querySelector('.second-place .score:nth-of-type(1)').textContent = 
      `Faturamento: ${second.faturamentoFormatado}`;
    document.querySelector('.second-place .score:nth-of-type(2)').textContent = 
      `Vendas: ${second.vendas}`;
    
    // Terceiro lugar
    document.querySelector('.third-place h2').textContent = third.nome;
    document.querySelector('.third-place .score:nth-of-type(1)').textContent = 
      `Faturamento: ${third.faturamentoFormatado}`;
    document.querySelector('.third-place .score:nth-of-type(2)').textContent = 
      `Vendas: ${third.vendas}`;
  }

  function updateLeaderboardList(ranking) {
    const leaderboardSection = document.querySelector('.leaderboard-section');
    const leaderboardTitle = leaderboardSection.querySelector('.leaderboard-title');
    
    // Limpar lista existente, mantendo apenas o título
    leaderboardSection.innerHTML = '';
    leaderboardSection.appendChild(leaderboardTitle);
    
    // Criar itens para cada vendedor
    ranking.forEach((vendedor, index) => {
      const item = document.createElement('div');
      item.className = 'leaderboard-item';
      item.dataset.vendedor = vendedor.nome;
      
      item.innerHTML = `
        <span class="ranking-position">${index + 1}</span>
        <img class="foto-vendedor" src="fotos/${vendedor.nome}.jpg" alt="${vendedor.nome}" onerror="this.src='fotos/default.jpg'">
        <div class="info-vendedor">
          <span class="nome-vendedor">${vendedor.nome}</span>
          <div class="progress-bar">
            <div class="progress" style="width: ${vendedor.percentualMeta}%;" data-percent="${vendedor.percentualMeta}%"></div>
          </div>
          <span class="faturamento">Faturamento: ${vendedor.faturamentoFormatado}</span>
          <span class="ticket-medio">Ticket Médio: R$ ${vendedor.ticketMedio}</span>
        </div>
      `;
      
      // Adicionar event listener para abrir modal
      item.addEventListener('click', () => {
        abrirModalVendas(vendedor.nome);
      });
      
      leaderboardSection.appendChild(item);
    });
  }

  // ======================
  // SEÇÃO: CONTAGEM REGRESSIVA
  // ======================
  const targetDate = new Date("2025-02-28T23:59:59");
  const countdownEl = document.getElementById("countdown");

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      countdownEl.textContent = "00:00:00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownEl.textContent = 
      (days > 0 ? days + "d " : "") +
      (hours < 10 ? "0" + hours : hours) + ":" +
      (minutes < 10 ? "0" + minutes : minutes) + ":" +
      (seconds < 10 ? "0" + seconds : seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ======================
  // SEÇÃO: MODAL DE VENDAS
  // ======================
  const modal = document.getElementById("modal-sales");
  const closeModalBtn = document.querySelector(".close-modal");
  const salesTitle = document.getElementById("sales-title");
  const salesTableBody = document.querySelector("#sales-table tbody");

  async function abrirModalVendas(nome) {
    try {
      // Define o título do modal
      salesTitle.textContent = `Vendas de ${nome}`;
      
      // Limpa o corpo da tabela
      salesTableBody.innerHTML = "";
      
      // Busca vendas do backend
      const response = await fetch(`${API_URL}/sales/details/${nome}`);
      const vendas = await response.json();
      
      // Cria uma linha de tabela para cada venda
      vendas.forEach(venda => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${venda.email}</td>
          <td>${venda.dataHora}</td>
          <td>${venda.valor}</td>
        `;
        salesTableBody.appendChild(row);
      });
      
      // Exibe o modal
      modal.style.display = "block";
    } catch (error) {
      console.error(`Erro ao buscar vendas de ${nome}:`, error);
      alert('Erro ao carregar detalhes das vendas. Tente novamente mais tarde.');
    }
  }

  // Fecha o modal ao clicar no botão "x"
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Fecha o modal se o usuário clicar fora do conteúdo do modal
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
  
  // Inicializar carregando os dados
  loadRankingData();
  
  // Opcionalmente, atualize os dados periodicamente (a cada 5 minutos)
  setInterval(loadRankingData, 5 * 60 * 1000);
});
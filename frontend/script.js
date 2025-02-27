document.addEventListener("DOMContentLoaded", () => {
  // URL do backend (altere para seu endereço real quando implantar)
  const API_URL = 'http://localhost:3000/api';
  
  // Armazenar estado anterior das vendas para comparação
  let previousSalesData = null;
  
  // Configurar o som do sino
  const bellSound = new Audio('bell.mp3');

  // ======================
  // SEÇÃO: CARREGAR DADOS
  // ======================
  async function loadRankingData() {
    try {
      console.log('Carregando dados de ranking...');
      const response = await fetch(`${API_URL}/sales/ranking`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro no servidor: ${errorData.message || 'Desconhecido'}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos:', data);
      
      // Verificar se há novas vendas
      checkForNewSales(data);
      
      updateRankingUI(data);
    } catch (error) {
      console.error('Erro ao carregar dados de ranking:', error);
      alert(`Erro ao carregar dados: ${error.message}. Tente novamente mais tarde.`);
    }
  }

  // Função para verificar se há novas vendas
  function checkForNewSales(currentData) {
    if (!previousSalesData) {
      // Primeira carga de dados, apenas armazenar para referência futura
      previousSalesData = JSON.parse(JSON.stringify(currentData));
      return;
    }
    
    // Calcular total de vendas anterior
    const previousTotalSales = previousSalesData.ranking.reduce(
      (total, vendedor) => total + vendedor.vendas, 0
    );
    
    // Calcular total de vendas atual
    const currentTotalSales = currentData.ranking.reduce(
      (total, vendedor) => total + vendedor.vendas, 0
    );
    
    // Se o número total de vendas aumentou, tocar o sino
    if (currentTotalSales > previousTotalSales) {
      const newSalesCount = currentTotalSales - previousTotalSales;
      console.log(`Detectadas ${newSalesCount} nova(s) venda(s)!`);
      
      // Tocar o som do sino
      playSaleAlert(newSalesCount);
      
      // Opcionalmente, exibir um toast ou notificação
      showNewSaleNotification(newSalesCount);
    }
    
    // Atualizar referência para a próxima verificação
    previousSalesData = JSON.parse(JSON.stringify(currentData));
  }
  
  // Função para tocar o som do sino
  function playSaleAlert(count = 1) {
    // Reiniciar o som caso esteja tocando
    bellSound.pause();
    bellSound.currentTime = 0;
    
    // Tocar o som
    bellSound.play().catch(error => {
      console.error('Erro ao tocar som de alerta:', error);
      // Muitos navegadores bloqueiam reprodução automática de áudio
      // até que haja uma interação do usuário com a página
    });
  }
  
  // Função para exibir notificação de nova venda
  function showNewSaleNotification(count) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'sale-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1iZWxsIj48cGF0aCBkPSJNMTggOEExNiAyMSAwIDAgMCAxOCAiPjwvcGF0aD48cGF0aCBkPSJNNiA4YTYgNiAwIDAgMSAxMiAwYzAgNyAzIDkgMyA5SDBzMyAyIDMgOSI+PC9wYXRoPjxwYXRoIGQ9Ik0xMCAxN2MwIDEgMSAzIDQgMyBzNCAtMiA0IC0zIj48L3BhdGg+PC9zdmc+" 
             alt="Sino" class="bell-icon" />
        <span>${count} ${count === 1 ? 'nova venda' : 'novas vendas'} registrada${count === 1 ? '' : 's'}!</span>
      </div>
    `;
    
    // Estilizar a notificação
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#2B5AE1',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: '1000',
      opacity: '0',
      transform: 'translateY(-20px)',
      transition: 'all 0.3s ease'
    });
    
    // Estilizar o conteúdo da notificação
    const content = notification.querySelector('.notification-content');
    Object.assign(content.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    });
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remover após 3 segundos
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      
      // Remover do DOM após a animação
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  function updateRankingUI(data) {
    const { ranking, totalTime, totalPodium } = data;
    
    // Atualizar totais
    document.getElementById('total-time').textContent = totalTime;
    document.getElementById('total-top3').textContent = totalPodium;
    
    // Atualizar pódio se tiver pelo menos 3 vendedores
    if (ranking.length >= 3) {
      updatePodium(ranking[0], ranking[1], ranking[2]);
    } else if (ranking.length > 0) {
      // Se não tiver 3 vendedores, exibe os disponíveis
      const defaultVendedor = {
        nome: "Sem dados",
        faturamentoFormatado: "R$ 0,00",
        vendas: 0
      };
      
      updatePodium(
        ranking[0], 
        ranking.length > 1 ? ranking[1] : defaultVendedor, 
        ranking.length > 2 ? ranking[2] : defaultVendedor
      );
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
    
    // Atualizar imagens do pódio se disponíveis
    updateAvatarImage('.first-place .avatar img', first.nome);
    updateAvatarImage('.second-place .avatar img', second.nome);
    updateAvatarImage('.third-place .avatar img', third.nome);
  }
  
  function updateAvatarImage(selector, nome) {
    const imgElement = document.querySelector(selector);
    if (imgElement) {
      // Verificar todas as extensões de arquivo possíveis
      tryLoadImage(imgElement, nome, ['jpg', 'jpeg', 'png', 'gif']);
    }
  }
  
  function tryLoadImage(imgElement, nome, extensions, index = 0) {
    if (index >= extensions.length) {
      // Se todas as extensões falharem, use a imagem padrão
      imgElement.src = 'fotos/default.jpg';
      return;
    }
    
    // Tentar carregar a imagem com a extensão atual
    const ext = extensions[index];
    imgElement.src = `fotos/${nome}.${ext}`;
    
    // Se falhar, tentar a próxima extensão
    imgElement.onerror = function() {
      tryLoadImage(imgElement, nome, extensions, index + 1);
    };
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
        <img class="foto-vendedor" src="fotos/default.jpg" alt="${vendedor.nome}">
        <div class="info-vendedor">
          <span class="nome-vendedor">${vendedor.nome}</span>
          <div class="progress-bar">
            <div class="progress" style="width: ${vendedor.percentualMeta}%;" data-percent="${vendedor.percentualMeta}%"></div>
          </div>
          <span class="faturamento">Faturamento: ${vendedor.faturamentoFormatado}</span>
          <span class="ticket-medio">Ticket Médio: ${vendedor.ticketMedioFormatado || `R$ ${vendedor.ticketMedio}`}</span>
        </div>
      `;
      
      // Adicionar event listener para abrir modal
      item.addEventListener('click', () => {
        abrirModalVendas(vendedor.nome);
      });
      
      leaderboardSection.appendChild(item);
      
      // Tentar carregar a foto com diferentes extensões
      const imgElement = item.querySelector('.foto-vendedor');
      tryLoadImage(imgElement, vendedor.nome, ['jpg', 'jpeg', 'png', 'gif']);
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
      
      // Mostra um indicador de carregamento
      salesTableBody.innerHTML = "<tr><td colspan='3'>Carregando...</td></tr>";
      
      // Exibe o modal (antes da busca para melhor experiência)
      modal.style.display = "block";
      
      // Busca vendas do backend
      const response = await fetch(`${API_URL}/sales/details/${nome}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const vendas = await response.json();
      
      // Limpa mensagem de carregamento
      salesTableBody.innerHTML = "";
      
      if (vendas.length === 0) {
        salesTableBody.innerHTML = "<tr><td colspan='3'>Nenhuma venda encontrada</td></tr>";
        return;
      }
      
      // Cria uma linha de tabela para cada venda
      vendas.forEach(venda => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${venda.email || 'N/A'}</td>
          <td>${venda.dataHora || 'N/A'}</td>
          <td>${venda.valor || 'R$ 0,00'}</td>
        `;
        salesTableBody.appendChild(row);
      });
    } catch (error) {
      console.error(`Erro ao buscar vendas de ${nome}:`, error);
      salesTableBody.innerHTML = `<tr><td colspan='3'>Erro ao carregar vendas: ${error.message}</td></tr>`;
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
  
  // Adicionar um botão para teste do som (opcional, pode ser removido em produção)
  const addTestButton = () => {
    const testButton = document.createElement('button');
    testButton.textContent = 'Testar Som';
    testButton.style.position = 'fixed';
    testButton.style.bottom = '20px';
    testButton.style.right = '20px';
    testButton.style.zIndex = '1000';
    testButton.style.padding = '10px 15px';
    testButton.style.background = '#6925D2';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '5px';
    testButton.style.cursor = 'pointer';
    
    testButton.addEventListener('click', () => {
      playSaleAlert();
      showNewSaleNotification(1);
    });
    
    document.body.appendChild(testButton);
  };
  
  // Descomentar a linha abaixo para adicionar o botão de teste
  // addTestButton();
  
  // Inicializar carregando os dados
  loadRankingData();
  
  // Atualizar os dados a cada 30 segundos (30.000ms)
  // Frequência aumentada para detectar novas vendas mais rapidamente
  setInterval(loadRankingData, 30 * 1000);
});
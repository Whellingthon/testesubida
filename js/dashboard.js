// Escuta alterações na memória local para atualizar em tempo real
window.addEventListener('storage', () => {
    carregarDadosDashboard();
});

// Carrega os dados na primeira vez que a página abre
document.addEventListener('DOMContentLoaded', () => {
    carregarDadosDashboard();
});

let meuGraficoPizza = null;
let meuGraficoBarras = null;

function carregarDadosDashboard() {
    // Resgata os dados salvos pelo script_2.js
    const bancoDeDados = JSON.parse(localStorage.getItem('bancoCSAT')) || [];

    // Atualiza o KPI de total de votos
    document.getElementById('total-votos').textContent = bancoDeDados.length;

    if (bancoDeDados.length === 0) {
        return;
    }

    // Variáveis de contagem
    let qtdFeliz = 0;
    let qtdSeria = 0;
    let qtdBrava = 0;
    const contagemMotivos = {};

    // Processa as contagens
    bancoDeDados.forEach(registro => {
        if (registro.nota === 'Feliz') qtdFeliz++;
        else if (registro.nota === 'Seria') qtdSeria++;
        else if (registro.nota === 'Brava') qtdBrava++;

        if (registro.motivo && registro.motivo !== 'N/A') {
            if (contagemMotivos[registro.motivo]) {
                contagemMotivos[registro.motivo]++;
            } else {
                contagemMotivos[registro.motivo] = 1;
            }
        }
    });

    // Renderiza os gráficos com as novas contagens
    renderizarGraficoPizza(qtdFeliz, qtdSeria, qtdBrava);
    renderizarGraficoBarras(contagemMotivos);
}

function renderizarGraficoPizza(feliz, seria, brava) {
    const ctx = document.getElementById('graficoPizza').getContext('2d');
    
    if (meuGraficoPizza) meuGraficoPizza.destroy();
    
    meuGraficoPizza = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Feliz 😍', 'Séria 😐', 'Brava 😡'],
            datasets: [{
                data: [feliz, seria, brava],
                backgroundColor: ['#2ed573', '#ffa502', '#ff4757'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }// explica essa parte
    });
}

function renderizarGraficoBarras(contagemMotivos) {
    const ctx = document.getElementById('graficoBarras').getContext('2d');
    
    if (meuGraficoBarras) meuGraficoBarras.destroy();

    const labels = Object.keys(contagemMotivos);
    const data = Object.values(contagemMotivos);

    meuGraficoBarras = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Volume de Reclamações',
                data: data,
                backgroundColor: '#1e90ff',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            plugins: { legend: { display: false } }
        }
    });
}
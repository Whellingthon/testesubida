const TEMPO_TIMEOUT = 15000; // 15 segundos de inatividade
let timeoutInatividade;

// 1. Roteador Principal de Emoções (Executado no index.html)
function registrarNota(nota) {
    // Salva a nota no navegador para a próxima página lembrar
    localStorage.setItem('notaAtual', nota);
    
    if (nota === 'Feliz') {
        salvarNoDashboard('Feliz', 'N/A', 'N/A');
        // Redireciona diretamente para a tela final
        window.location.href = 'agradecimento.html';
        
    } else if (nota === 'Seria') {
        // Redireciona para a tela de motivos
        window.location.href = 'motivo.html';
        
    } else if (nota === 'Brava') {
        // Redireciona para a tela do gerente
        window.location.href = 'contato.html';
    }
}

// 2. Finaliza fluxo da Carinha Séria (Executado no motivo.html)
function finalizarComMotivo(motivo) {
    // Recupera a nota que foi salva na página anterior
    const notaGuardada = localStorage.getItem('notaAtual');
    
    salvarNoDashboard(notaGuardada, motivo, 'N/A');
    window.location.href = 'agradecimento.html';
}

// 3. Finaliza fluxo da Carinha Brava (Executado no contato.html)
function finalizarComTelefone() {
    const inputTelefone = document.getElementById('input-telefone');
    const telefoneDigitado = inputTelefone.value.trim();
    
    if(telefoneDigitado.length < 8) {
        alert("Por favor, digite um número válido para o gerente te ligar.");
        return;
    }
    
    const notaGuardada = localStorage.getItem('notaAtual');
    salvarNoDashboard(notaGuardada, 'Péssimo Atendimento', telefoneDigitado);
    window.location.href = 'agradecimento.html';
}

function salvarNoDashboard(nota, motivo, telefone) {
    let banco = JSON.parse(localStorage.getItem('bancoCSAT')) || [];
    
    // Remova a linha "banco.push({ nota, motivo, telefone });" que causava a duplicidade
    
    const novoRegistro = {
        dataHora: new Date().toLocaleString('pt-BR'),
        nota: nota,
        motivo: motivo,
        telefoneContato: telefone
    };
    
    banco.push(novoRegistro);
    localStorage.setItem('bancoCSAT', JSON.stringify(banco));
    
    console.log("📊 DASHBOARD ATUALIZADO:");
    console.table(banco);
}

// 5. O Monstro da Impaciência (Timeout nas páginas intermediárias)
function iniciarTimeout() {
    // Resetar timer se o usuário tocar em qualquer lugar da tela
    document.body.addEventListener('click', resetarTimer);
    document.body.addEventListener('touchstart', resetarTimer);
    
    timeoutInatividade = setTimeout(() => {
        console.warn("⏱️ Timeout: O aluno abandonou a pesquisa. Voltando ao início...");
        voltarInicio();
    }, TEMPO_TIMEOUT);
}

function resetarTimer() {
    clearTimeout(timeoutInatividade);
    timeoutInatividade = setTimeout(() => {
        voltarInicio();
    }, TEMPO_TIMEOUT);
}

// 6. Voltar ao Início
function voltarInicio() {
    // Limpa a nota temporária
    localStorage.removeItem('notaAtual');
    // Manda de volta para o index
    window.location.href = 'index.html';
}

// 7. Automação da Tela de Agradecimento (Se estiver na agradecimento.html)
if (window.location.pathname.includes('agradecimento.html')) {
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 4000); // 4 segundos de agradecimento e volta sozinho
}
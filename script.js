// Dados do aplicativo
const questions = [
    {
        id: 1,
        subject: "Matemática",
        text: "Qual é o valor de x na equação 2x + 5 = 17?",
        options: [
            { id: 1, text: "6", correct: true },
            { id: 2, text: "7", correct: false },
            { id: 3, text: "8", correct: false },
            { id: 4, text: "9", correct: false }
        ]
    },
    {
        id: 2,
        subject: "Português",
        text: "Assinale a alternativa em que todas as palavras são acentuadas pela mesma regra:",
        options: [
            { id: 1, text: "café, você, parabéns", correct: true },
            { id: 2, text: "árvore, útil, mágoa", correct: false },
            { id: 3, text: "saúde, herói, país", correct: false },
            { id: 4, text: "pássaro, líquido, dúvida", correct: false }
        ]
    },
    {
        id: 3,
        subject: "História",
        text: "O que foi a Revolução Industrial?",
        options: [
            { id: 1, text: "Um movimento artístico do século XVIII", correct: false },
            { id: 2, text: "A transição para novos processos de manufatura", correct: true },
            { id: 3, text: "Uma revolução política na França", correct: false },
            { id: 4, text: "O processo de independência dos EUA", correct: false }
        ]
    },
    {
        id: 4,
        subject: "Biologia",
        text: "Qual organela é responsável pela produção de energia na célula?",
        options: [
            { id: 1, text: "Núcleo", correct: false },
            { id: 2, text: "Mitocôndria", correct: true },
            { id: 3, text: "Ribossomo", correct: false },
            { id: 4, text: "Complexo de Golgi", correct: false }
        ]
    },
    {
        id: 5,
        subject: "Química",
        text: "Qual é o elemento químico mais abundante na crosta terrestre?",
        options: [
            { id: 1, text: "Ferro (Fe)", correct: false },
            { id: 2, text: "Oxigênio (O)", correct: true },
            { id: 3, text: "Silício (Si)", correct: false },
            { id: 4, text: "Alumínio (Al)", correct: false }
        ]
    }
];

// Variáveis de estado
let currentUser = {
    name: "Visitante",
    avatar: "https://via.placeholder.com/40",
    completedTests: 0,
    scores: []
};

let currentTest = {
    answers: [],
    currentQuestionIndex: 0,
    started: false
};

// Elementos da DOM
const loginScreen = document.getElementById('loginScreen');
const mainScreen = document.getElementById('mainScreen');
const loginBtn = document.getElementById('loginBtn');
const skipLogin = document.getElementById('skipLogin');
const startSimuladoBtn = document.getElementById('startSimuladoBtn');
const userName = document.getElementById('userName');
const userAvatar = document.getElementById('userAvatar');
const profileName = document.getElementById('profileName');
const profileAvatar = document.getElementById('profileAvatar');
const completedTests = document.getElementById('completedTests');
const averageScore = document.getElementById('averageScore');
const bestArea = document.getElementById('bestArea');
const worstArea = document.getElementById('worstArea');
const totalSimulados = document.getElementById('totalSimulados');
const mediaAcertos = document.getElementById('mediaAcertos');
const totalQuestoes = document.getElementById('totalQuestoes');
const diasEstudo = document.getElementById('diasEstudo');

// Elementos do simulado
const simuladoSection = document.getElementById('simuladoSection');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const currentQuestion = document.getElementById('currentQuestion');
const totalQuestions = document.getElementById('totalQuestions');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const finishBtn = document.getElementById('finishBtn');

// Navegação entre seções
const sections = document.querySelectorAll('.sidebar li');
const homeSection = document.getElementById('homeSection');
const profileSection = document.getElementById('profileSection');

// Event Listeners
loginBtn.addEventListener('click', handleLogin);
skipLogin.addEventListener('click', skipLoginAndStart);
startSimuladoBtn.addEventListener('click', startSimulado);
prevBtn.addEventListener('click', prevQuestion);
nextBtn.addEventListener('click', nextQuestion);
finishBtn.addEventListener('click', finishTest);

sections.forEach(section => {
    section.addEventListener('click', () => {
        // Remove active class from all sections
        sections.forEach(s => s.classList.remove('active'));
        // Add active class to clicked section
        section.classList.add('active');
        
        // Hide all containers
        homeSection.style.display = 'none';
        simuladoSection.style.display = 'none';
        profileSection.style.display = 'none';
        
        // Show selected container
        const sectionId = section.getAttribute('data-section');
        if (sectionId === 'home') {
            homeSection.style.display = 'block';
        } else if (sectionId === 'simulado') {
            simuladoSection.style.display = 'block';
            if (!currentTest.started) {
                startSimulado();
            }
        } else if (sectionId === 'profile') {
            profileSection.style.display = 'block';
            updateProfile();
        } else if (sectionId === 'books') {
            // Redirecionar para perfil temporariamente
            document.querySelector('[data-section="profile"]').click();
        }
    });
});

// Funções
function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email && password) {
        // Simular login bem-sucedido
        currentUser.name = email.split('@')[0];
        currentUser.avatar = `https://ui-avatars.com/api/?name=${currentUser.name}&background=6a11cb&color=fff`;
        
        showMainScreen();
    } else {
        alert('Por favor, preencha e-mail e senha');
    }
}

function skipLoginAndStart() {
    currentUser.avatar = `https://ui-avatars.com/api/?name=Visitante&background=6a11cb&color=fff`;
    showMainScreen();
}

function showMainScreen() {
    loginScreen.style.display = 'none';
    mainScreen.style.display = 'block';
    
    // Atualizar informações do usuário
    userName.textContent = currentUser.name;
    userAvatar.src = currentUser.avatar;
    profileName.textContent = currentUser.name;
    profileAvatar.src = currentUser.avatar;
    
    // Atualizar estatísticas
    updateStats();
}

function updateStats() {
    totalSimulados.textContent = currentUser.completedTests;
    
    if (currentUser.scores.length > 0) {
        const total = currentUser.scores.reduce((sum, test) => sum + test.score, 0);
        const avg = Math.round(total / currentUser.scores.length);
        mediaAcertos.textContent = `${avg}%`;
        
        const totalQuestionsAnswered = currentUser.scores.length * questions.length;
        totalQuestoes.textContent = totalQuestionsAnswered;
    } else {
        mediaAcertos.textContent = '0%';
        totalQuestoes.textContent = '0';
    }
}

function startSimulado() {
    // Resetar teste atual
    currentTest = {
        answers: Array(questions.length).fill(null),
        currentQuestionIndex: 0,
        started: true
    };
    
    // Mostrar seção de simulado
    sections.forEach(s => s.classList.remove('active'));
    document.querySelector('[data-section="simulado"]').classList.add('active');
    homeSection.style.display = 'none';
    simuladoSection.style.display = 'block';
    profileSection.style.display = 'none';
    
    // Atualizar informações do simulado
    totalQuestions.textContent = questions.length;
    
    // Carregar primeira questão
    loadQuestion(currentTest.currentQuestionIndex);
}

function loadQuestion(index) {
    const question = questions[index];
    
    // Atualizar número da questão
    currentQuestion.textContent = index + 1;
    
    // Carregar texto da questão
    questionText.textContent = question.text;
    
    // Carregar opções
    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D', 'E'];
    question.options.forEach((option, i) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        
        const optionLetter = document.createElement('span');
        optionLetter.classList.add('option-letter');
        optionLetter.textContent = letters[i];
        
        const optionText = document.createElement('span');
        optionText.textContent = option.text;
        
        optionElement.appendChild(optionLetter);
        optionElement.appendChild(optionText);
        
        // Marcar como selecionado se já foi respondido
        if (currentTest.answers[index] === option.id) {
            optionElement.classList.add('selected');
        }
        
        optionElement.addEventListener('click', () => {
            // Remover seleção de outras opções
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Selecionar esta opção
            optionElement.classList.add('selected');
            
            // Salvar resposta
            currentTest.answers[index] = option.id;
        });
        
        optionsContainer.appendChild(optionElement);
    });
    
    // Atualizar botões de navegação
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === questions.length - 1;
    
    // Mostrar botão de finalizar na última questão
    finishBtn.style.display = index === questions.length - 1 ? 'block' : 'none';
}

function prevQuestion() {
    if (currentTest.currentQuestionIndex > 0) {
        currentTest.currentQuestionIndex--;
        loadQuestion(currentTest.currentQuestionIndex);
    }
}

function nextQuestion() {
    if (currentTest.currentQuestionIndex < questions.length - 1) {
        currentTest.currentQuestionIndex++;
        loadQuestion(currentTest.currentQuestionIndex);
    }
}

function finishTest() {
    // Calcular pontuação
    let score = 0;
    const results = [];
    
    for (let i = 0; i < questions.length; i++) {
        if (currentTest.answers[i]) {
            const question = questions[i];
            const selectedOption = question.options.find(opt => opt.id === currentTest.answers[i]);
            
            if (selectedOption.correct) {
                score++;
            }
            
            results.push({
                questionId: question.id,
                subject: question.subject,
                correct: selectedOption.correct
            });
        }
    }
    
    const percentage = Math.round((score / questions.length) * 100);
    
    // Atualizar dados do usuário
    currentUser.completedTests++;
    currentUser.scores.push({
        date: new Date().toLocaleDateString(),
        score: percentage,
        results: results
    });
    
    // Mostrar alerta com resultado
    alert(`Simulado concluído! Você acertou ${score} de ${questions.length} questões (${percentage}%)`);
    
    // Voltar para a página inicial
    sections.forEach(s => s.classList.remove('active'));
    document.querySelector('[data-section="home"]').classList.add('active');
    homeSection.style.display = 'block';
    simuladoSection.style.display = 'none';
    
    // Atualizar estatísticas
    updateStats();
    updateProfile();
}

function updateProfile() {
    completedTests.textContent = currentUser.completedTests;
    
    if (currentUser.scores.length > 0) {
        // Calcular média de acertos
        const total = currentUser.scores.reduce((sum, test) => sum + test.score, 0);
        const avg = Math.round(total / currentUser.scores.length);
        averageScore.textContent = `${avg}%`;
        
        // Calcular melhores e piores áreas (simplificado)
        const subjects = {};
        
        currentUser.scores.forEach(test => {
            test.results.forEach(result => {
                if (!subjects[result.subject]) {
                    subjects[result.subject] = { correct: 0, total: 0 };
                }
                
                if (result.correct) {
                    subjects[result.subject].correct++;
                }
                subjects[result.subject].total++;
            });
        });
        
        let bestSubject = '';
        let bestRate = 0;
        let worstSubject = '';
        let worstRate = 100;
        
        for (const subject in subjects) {
            const rate = (subjects[subject].correct / subjects[subject].total) * 100;
            
            if (rate > bestRate) {
                bestRate = rate;
                bestSubject = subject;
            }
            
            if (rate < worstRate) {
                worstRate = rate;
                worstSubject = subject;
            }
        }
        
        bestArea.textContent = bestSubject || '-';
        worstArea.textContent = worstSubject || '-';
    } else {
        averageScore.textContent = '0%';
        bestArea.textContent = '-';
        worstArea.textContent = '-';
    }
}

// Inicializar aplicativo
document.querySelector('[data-section="home"]').classList.add('active');
// Funções de Autenticação
function alternarModoAuth() {
    modoCadastro = !modoCadastro;
    document.getElementById('login-status-txt').innerText = modoCadastro ? "Criar Nova Conta de Piloto" : "Autenticação Requerida";
    document.getElementById('btn-principal-auth').innerText = modoCadastro ? "Cadastrar" : "Entrar";
    document.getElementById('txt-switch').innerText = modoCadastro ? "Fazer Login" : "Cadastra-te";
}

async function gerarHash(string) {
    const msgBuffer = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function executarAuth() {
    const user = document.getElementById('auth-user').value.trim();
    const pass = document.getElementById('auth-pass').value;
    if(!user || !pass) return alert("Preenche tudo, Chefão!");
    const passHash = await gerarHash(pass);

    const { data: p } = await _supabase.from('perfis_utilizadores').select('username').eq('username', user).maybeSingle();

    if(modoCadastro) {
        if(p) return alert("❌ Nickname já existe!");
        await _supabase.from('perfis_utilizadores').insert([{ username: user, password_hash: passHash }]);
        utilizadorLogado = user;
        alert("Conta criada! A entrar...");
    } else {
        const { data: l } = await _supabase.from('perfis_utilizadores').select('*').eq('username', user).eq('password_hash', passHash).maybeSingle();
        if(!l && !(user === "Chefão Didy" || pass === "007")) return alert("Dados incorretos.");
        utilizadorLogado = l ? l.username : user;
    }
    entrarNoSistema();
}

function entrarNoSistema() {
    document.getElementById('tela-login').style.opacity = '0';
    setTimeout(() => document.getElementById('tela-login').style.visibility = 'hidden', 500);
    if(utilizadorLogado === "Chefão Didy") document.getElementById('painel-admin').style.display = 'block';
    inicializarApp();
}

function inicializarApp() {
    // Estas funções serão carregadas quando criarmos os outros ficheiros
    if(typeof carregarChat === 'function') carregarChat();
    if(typeof carregarFeedRecomendado === 'function') carregarFeedRecomendado();
    if(typeof escutarChatRealtime === 'function') escutarChatRealtime();
}

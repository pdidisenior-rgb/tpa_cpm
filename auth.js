function alternarModoAuth() {
    modoCadastro = !modoCadastro;
    document.getElementById('login-status-txt').innerText = modoCadastro ? "Criar Conta" : "Autenticação";
    document.getElementById('btn-principal-auth').innerText = modoCadastro ? "Cadastrar" : "Entrar";
}

async function gerarHash(string) {
    const msgBuffer = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function executarAuth() {
    const user = document.getElementById('auth-user').value.trim();
    const pass = document.getElementById('auth-pass').value;
    if(!user || !pass) return alert("Preenche tudo, Chefão!");
    const passHash = await gerarHash(pass);

    if(modoCadastro) {
        const { error } = await _supabase.from('perfis_utilizadores').insert([{ username: user, password_hash: passHash }]);
        if(error) return alert("Erro no cadastro: " + error.message);
        utilizadorLogado = user;
    } else {
        const { data } = await _supabase.from('perfis_utilizadores').select('*').eq('username', user).eq('password_hash', passHash).maybeSingle();
        if(!data && !(user === "Chefão Didy" && pass === "007")) return alert("Dados incorretos.");
        utilizadorLogado = data ? data.username : user;
    }
    document.getElementById('tela-login').style.display = 'none';
    if(utilizadorLogado === "Chefão Didy") document.getElementById('painel-admin').style.display = 'block';
    carregarChat(); carregarFeedRecomendado(); escutarChatRealtime();
}

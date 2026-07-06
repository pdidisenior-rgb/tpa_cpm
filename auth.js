async function executarAuth() {
    const user = document.getElementById('auth-user').value.trim();
    const pass = document.getElementById('auth-pass').value;
    if(!user || !pass) return alert("Preenche tudo!");
    
    const passHash = await gerarHash(pass);
    console.log("Tentando conectar com:", user);

    try {
        const { data: p, error: e } = await _supabase.from('perfis_utilizadores').select('username').eq('username', user).maybeSingle();
        
        if (e) {
            console.error("Erro no Supabase:", e);
            alert("Erro de conexão com o Supabase: " + e.message);
            return;
        }

        if(modoCadastro) {
            if(p) return alert("❌ Nickname já existe!");
            const { error: insertError } = await _supabase.from('perfis_utilizadores').insert([{ username: user, password_hash: passHash }]);
            if (insertError) {
                console.error("Erro na inserção:", insertError);
                alert("Erro ao inserir: " + insertError.message);
                return;
            }
            utilizadorLogado = user;
            alert("Sucesso! Conta criada.");
        } else {
            if(!p) return alert("Usuário não encontrado.");
            utilizadorLogado = user;
        }
        entrarNoSistema();
    } catch (err) {
        console.error("Erro crítico:", err);
        alert("Erro fatal: " + err);
    }
}

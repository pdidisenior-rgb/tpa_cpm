async function carregarChat() {
    const { data } = await _supabase.from('chat_pilotos').select('*').order('criado_em', { ascending: true });
    const box = document.getElementById('chat-box');
    box.innerHTML = '';
    if(data) data.forEach(m => box.innerHTML += `<div><b>${m.username}</b>: ${m.mensagem}</div>`);
}

async function enviarMensagemChat() {
    const txt = document.getElementById('chat-msg').value;
    await _supabase.from('chat_pilotos').insert([{ username: utilizadorLogado, mensagem: txt }]);
    document.getElementById('chat-msg').value = '';
}

function escutarChatRealtime() {
    _supabase.channel('chat').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_pilotos' }, () => carregarChat()).subscribe();
}

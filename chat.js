async function carregarChat() {
    const { data } = await _supabase.from('chat_pilotos').select('*').order('criado_em', { ascending: true }).limit(80);
    const box = document.getElementById('chat-box');
    if(!box) return;
    box.innerHTML = '';
    data.forEach(m => box.innerHTML += `<div class="msg-box"><div class="msg-user">${m.username}</div><div>${m.mensagem}</div></div>`);
    box.scrollTop = box.scrollHeight;
}

async function enviarMensagemChat() {
    const txt = document.getElementById('chat-msg').value.trim();
    if(!txt) return;
    await _supabase.from('chat_pilotos').insert([{ username: utilizadorLogado, mensagem: txt }]);
    document.getElementById('chat-msg').value = '';
}

function escutarChatRealtime() {
    _supabase.channel('room-chat').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_pilotos' }, payload => {
        const box = document.getElementById('chat-box');
        if(!box) return;
        box.innerHTML += `<div class="msg-box"><div class="msg-user">${payload.new.username}</div><div>${payload.new.mensagem}</div></div>`;
        box.scrollTop = box.scrollHeight;
    }).subscribe();
}

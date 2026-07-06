async function carregarFeedRecomendado() {
    const { data } = await _supabase.from('feed_noticias').select('*').order('criado_em', { ascending: false });
    const feed = document.getElementById('feed-noticias');
    feed.innerHTML = '';
    if(data) data.forEach(p => feed.innerHTML += `<div class="card-post"><h3>${p.titulo}</h3><img src="${p.media_url}" class="post-media"></div>`);
}

async function criarPublicacao() {
    const file = document.getElementById('post-file').files[0];
    const { data: u } = await _supabase.storage.from('MIDIA_CPM').upload(Date.now().toString(), file);
    const { data: l } = _supabase.storage.from('MIDIA_CPM').getPublicUrl(u.path);
    await _supabase.from('feed_noticias').insert([{ titulo: document.getElementById('post-titulo').value, media_url: l.publicUrl }]);
    carregarFeedRecomendado();
}

async function carregarFeedRecomendado() {
    const { data: posts } = await _supabase.from('feed_noticias').select('*').order('criado_em', { ascending: false });
    const feed = document.getElementById('feed-noticias');
    if(!feed) return;
    feed.innerHTML = '';
    posts.forEach(p => {
        let mediaTag = p.media_url.toLowerCase().includes('.mp4') ? `<video src="${p.media_url}" class="post-media" controls></video>` : `<img src="${p.media_url}" class="post-media" alt="Foto">`;
        feed.innerHTML += `<div class="card-post"><div class="post-header"><span class="post-autor">📢 TPA_CPM</span></div>${mediaTag}<div class="post-titulo">${p.titulo}</div></div>`;
    });
}

async function criarPublicacao() {
    const fileInput = document.getElementById('post-file');
    const titulo = document.getElementById('post-titulo').value;
    if(!fileInput.files[0] || !titulo) return alert("Preenche tudo para publicar!");

    const file = fileInput.files[0];
    const { data: u } = await _supabase.storage.from('MIDIA_CPM').upload(`${Date.now()}`, file);
    const { data: l } = _supabase.storage.from('MIDIA_CPM').getPublicUrl(u.path);
    
    await _supabase.from('feed_noticias').insert([{ titulo: titulo, media_url: l.publicUrl }]);
    alert("Publicado no Feed, Chefão!");
    carregarFeedRecomendado();
}

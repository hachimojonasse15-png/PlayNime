/* =====================================================
   PlayNime - SCRIPT PRINCIPAL
===================================================== */

"use strict";


/* =====================================================
   CONFIGURAÇÃO
===================================================== */

const PLAYNIME_API =
    "https://api.jikan.moe/v4";


const PLAYNIME_FAVORITES_KEY =
    "playnime_favoritos";


/* =====================================================
   PEDIDO À JIKAN
===================================================== */

async function playNimeAPI(endpoint){

    try{

        const resposta =
            await fetch(
                PLAYNIME_API + endpoint
            );


        if(!resposta.ok){

            throw new Error(
                "HTTP " + resposta.status
            );

        }


        const json =
            await resposta.json();


        return json.data || [];

    }

    catch(erro){

        console.error(
            "PlayNime API:",
            erro
        );

        return [];

    }

}


/* =====================================================
   IMAGEM DO ANIME
===================================================== */

function playNimeImagem(anime){

    return (
        anime?.images?.jpg?.large_image_url ||
        anime?.images?.jpg?.image_url ||
        anime?.images?.jpg?.small_image_url ||
        ""
    );

}


/* =====================================================
   TÍTULO
===================================================== */

function playNimeTitulo(anime){

    return (
        anime?.title ||
        anime?.title_english ||
        anime?.title_japanese ||
        "Anime sem título"
    );

}


/* =====================================================
   FAVORITOS
===================================================== */

function playNimeObterFavoritos(){

    try{

        const dados =
            localStorage.getItem(
                PLAYNIME_FAVORITES_KEY
            );


        if(!dados){

            return [];

        }


        const favoritos =
            JSON.parse(dados);


        return Array.isArray(favoritos)
            ? favoritos
            : [];

    }

    catch(erro){

        console.error(
            "Erro nos favoritos:",
            erro
        );

        return [];

    }

}


/* =====================================================
   VERIFICAR FAVORITO
===================================================== */

function playNimeEhFavorito(id){

    const favoritos =
        playNimeObterFavoritos();


    return favoritos.some(
        anime =>
            String(anime?.mal_id) ===
            String(id)
    );

}


/* =====================================================
   ADICIONAR FAVORITO
===================================================== */

function playNimeAdicionarFavorito(anime){

    if(
        !anime ||
        !anime.mal_id
    ){

        return false;

    }


    const favoritos =
        playNimeObterFavoritos();


    const existe =
        favoritos.some(
            item =>
                String(item?.mal_id) ===
                String(anime.mal_id)
        );


    if(existe){

        return false;

    }


    favoritos.push(anime);


    try{

        localStorage.setItem(
            PLAYNIME_FAVORITES_KEY,
            JSON.stringify(favoritos)
        );

        return true;

    }

    catch(erro){

        console.error(
            "Erro ao guardar favorito:",
            erro
        );

        return false;

    }

}


/* =====================================================
   REMOVER FAVORITO
===================================================== */

function playNimeRemoverFavorito(id){

    const favoritos =
        playNimeObterFavoritos();


    const novosFavoritos =
        favoritos.filter(
            anime =>
                String(anime?.mal_id) !==
                String(id)
        );


    try{

        localStorage.setItem(
            PLAYNIME_FAVORITES_KEY,
            JSON.stringify(
                novosFavoritos
            )
        );

        return true;

    }

    catch(erro){

        console.error(
            "Erro ao remover favorito:",
            erro
        );

        return false;

    }

}


/* =====================================================
   ALTERNAR FAVORITO
===================================================== */

function playNimeAlternarFavorito(anime){

    if(
        !anime ||
        !anime.mal_id
    ){

        return false;

    }


    if(
        playNimeEhFavorito(
            anime.mal_id
        )
    ){

        playNimeRemoverFavorito(
            anime.mal_id
        );

        return false;

    }


    playNimeAdicionarFavorito(
        anime
    );

    return true;

}


/* =====================================================
   ABRIR DETALHES
===================================================== */

function playNimeAbrirAnime(id){

    if(!id){

        return;

    }


    window.location.href =
        "detalhes.html?id=" +
        encodeURIComponent(id);

}


/* =====================================================
   ID DO ANIME NA URL
===================================================== */

function playNimeObterIdURL(){

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    return parametros.get("id");

}


/* =====================================================
   ESCAPAR HTML
===================================================== */

function playNimeEscaparHTML(texto){

    return String(texto || "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   GÉNEROS
===================================================== */

function playNimeGeneros(anime){

    if(
        !anime ||
        !Array.isArray(anime.genres)
    ){

        return [];

    }


    return anime.genres.map(
        genero =>
            genero?.name
    ).filter(Boolean);

}


/* =====================================================
   NOTA
===================================================== */

function playNimeNota(anime){

    if(
        typeof anime?.score !==
        "number"
    ){

        return "N/A";

    }


    return anime.score.toFixed(1);

}


/* =====================================================
   INFORMAÇÃO DA TEMPORADA
===================================================== */

function playNimeTemporada(anime){

    const temporada =
        anime?.season;

    const ano =
        anime?.year;


    if(
        temporada &&
        ano
    ){

        return (
            temporada.charAt(0).toUpperCase() +
            temporada.slice(1) +
            " " +
            ano
        );

    }


    if(ano){

        return String(ano);

    }


    return "Ano desconhecido";

}


/* =====================================================
   EXPORTAÇÃO
===================================================== */

window.playNimeAPI =
    playNimeAPI;

window.playNimeImagem =
    playNimeImagem;

window.playNimeTitulo =
    playNimeTitulo;

window.playNimeObterFavoritos =
    playNimeObterFavoritos;

window.playNimeEhFavorito =
    playNimeEhFavorito;

window.playNimeAdicionarFavorito =
    playNimeAdicionarFavorito;

window.playNimeRemoverFavorito =
    playNimeRemoverFavorito;

window.playNimeAlternarFavorito =
    playNimeAlternarFavorito;

window.playNimeAbrirAnime =
    playNimeAbrirAnime;

window.playNimeObterIdURL =
    playNimeObterIdURL;

window.playNimeEscaparHTML =
    playNimeEscaparHTML;

window.playNimeGeneros =
    playNimeGeneros;

window.playNimeNota =
    playNimeNota;

window.playNimeTemporada =
    playNimeTemporada;

/* =====================================================
   PlayNime - SCRIPT PRINCIPAL
   TMDB
===================================================== */

"use strict";


/* =====================================================
   CONFIGURAÇÃO TMDB
===================================================== */

const PLAYNIME_TMDB_TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTg5Mzk0MmUwMWMyM2IzMTJkZjI2NWQ1NThlMjdmYyIsIm5iZiI6MTc4MTI0MDM4Ni41NzIsInN1YiI6IjZhMmI5MjQyOGQ2YWJiNWQyNWUzYjk5OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dbWkox1kPJDn85ah8IcU-ut5CotlJjPSFsYPEoJi080";


const PLAYNIME_TMDB_API =
    "https://api.themoviedb.org/3";


const PLAYNIME_TMDB_IMAGE =
    "https://image.tmdb.org/t/p/";


const PLAYNIME_LANGUAGE =
    "pt-BR";


const PLAYNIME_FAVORITES_KEY =
    "playnime_favoritos";


/* =====================================================
   PEDIDO AO TMDB
===================================================== */

async function playNimeAPI(endpoint){

    try{

        const resposta =
            await fetch(

                PLAYNIME_TMDB_API + endpoint,

                {

                    method:"GET",

                    headers:{

                        "Authorization":
                            "Bearer " +
                            PLAYNIME_TMDB_TOKEN,

                        "accept":
                            "application/json"

                    }

                }

            );


        if(!resposta.ok){

            throw new Error(
                "TMDB HTTP " +
                resposta.status
            );

        }


        const json =
            await resposta.json();


        /*
         * Endpoints como discover/tv
         * devolvem results.
         *
         * Endpoints de detalhes
         * devolvem o próprio objeto.
         */

        if(
            Array.isArray(
                json?.results
            )
        ){

            return json.results;

        }


        return json || null;

    }

    catch(erro){

        console.error(
            "PlayNime TMDB:",
            erro
        );

        return [];

    }

}


/* =====================================================
   IMAGEM DO TMDB
===================================================== */

function playNimeImagem(
    anime,
    tamanho="w500"
){

    if(!anime){

        return "";

    }


    /*
     * Se receber um objeto TMDB.
     */

    if(
        anime.poster_path
    ){

        return (
            PLAYNIME_TMDB_IMAGE +
            tamanho +
            anime.poster_path
        );

    }


    /*
     * Compatibilidade caso seja
     * passada diretamente uma URL.
     */

    if(
        typeof anime === "string"
    ){

        return anime;

    }


    return "";

}


/* =====================================================
   BACKDROP / BANNER
===================================================== */

function playNimeBanner(
    anime,
    tamanho="w1280"
){

    if(
        !anime ||
        !anime.backdrop_path
    ){

        return "";

    }


    return (
        PLAYNIME_TMDB_IMAGE +
        tamanho +
        anime.backdrop_path
    );

}


/* =====================================================
   TÍTULO
===================================================== */

function playNimeTitulo(
    anime
){

    return (

        anime?.name ||

        anime?.original_name ||

        anime?.title ||

        anime?.original_title ||

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
            JSON.parse(
                dados
            );


        return Array.isArray(
            favoritos
        )
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

function playNimeEhFavorito(
    id
){

    if(!id){

        return false;

    }


    const favoritos =
        playNimeObterFavoritos();


    return favoritos.some(

        anime =>

            String(
                anime?.id
            ) ===
            String(id)

    );

}


/* =====================================================
   ADICIONAR FAVORITO
===================================================== */

function playNimeAdicionarFavorito(
    anime
){

    if(
        !anime ||
        !anime.id
    ){

        return false;

    }


    const favoritos =
        playNimeObterFavoritos();


    const existe =
        favoritos.some(

            item =>

                String(
                    item?.id
                ) ===
                String(
                    anime.id
                )

        );


    if(existe){

        return false;

    }


    /*
     * Guardamos somente os dados
     * necessários para a página
     * de favoritos.
     */

    const favorito = {

        id:
            anime.id,

        name:
            anime.name ||
            anime.original_name ||
            anime.title ||
            anime.original_title ||
            "Anime sem título",

        poster_path:
            anime.poster_path ||
            null,

        backdrop_path:
            anime.backdrop_path ||
            null,

        vote_average:
            anime.vote_average ||
            0,

        first_air_date:
            anime.first_air_date ||
            "",

        overview:
            anime.overview ||
            ""

    };


    favoritos.push(
        favorito
    );


    try{

        localStorage.setItem(

            PLAYNIME_FAVORITES_KEY,

            JSON.stringify(
                favoritos
            )

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

function playNimeRemoverFavorito(
    id
){

    if(!id){

        return false;

    }


    const favoritos =
        playNimeObterFavoritos();


    const novosFavoritos =
        favoritos.filter(

            anime =>

                String(
                    anime?.id
                ) !==
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

function playNimeAlternarFavorito(
    anime
){

    if(
        !anime ||
        !anime.id
    ){

        return false;

    }


    if(
        playNimeEhFavorito(
            anime.id
        )
    ){

        playNimeRemoverFavorito(
            anime.id
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

function playNimeAbrirAnime(
    id
){

    if(!id){

        return;

    }


    window.location.href =
        "detalhes.html?id=" +
        encodeURIComponent(
            id
        );

}


/* =====================================================
   ID DO ANIME NA URL
===================================================== */

function playNimeObterIdURL(){

    const parametros =
        new URLSearchParams(

            window.location.search

        );


    return parametros.get(
        "id"
    );

}


/* =====================================================
   ESCAPAR HTML
===================================================== */

function playNimeEscaparHTML(
    texto
){

    return String(
        texto || ""
    )

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

function playNimeGeneros(
    anime
){

    if(
        !anime ||
        !Array.isArray(
            anime.genres
        )
    ){

        return [];

    }


    return anime.genres

        .map(
            genero =>
                genero?.name
        )

        .filter(Boolean);

}


/* =====================================================
   NOTA
===================================================== */

function playNimeNota(
    anime
){

    const nota =
        Number(
            anime?.vote_average
        );


    if(
        !Number.isFinite(nota) ||
        nota <= 0
    ){

        return "N/A";

    }


    return nota.toFixed(1);

}


/* =====================================================
   ANO
===================================================== */

function playNimeAno(
    anime
){

    const data =
        anime?.first_air_date ||
        anime?.release_date ||
        "";


    if(!data){

        return "Ano desconhecido";

    }


    return String(
        data
    ).substring(
        0,
        4
    );

}


/* =====================================================
   INFORMAÇÃO DA TEMPORADA
===================================================== */

function playNimeTemporada(
    anime
){

    if(
        !anime
    ){

        return "Temporada";

    }


    const temporada =
        anime.season_number;


    if(
        temporada
    ){

        return (
            "Temporada " +
            temporada
        );

    }


    return "Temporada";

}


/* =====================================================
   NÚMERO DE TEMPORADAS
===================================================== */

function playNimeNumeroTemporadas(
    anime
){

    const quantidade =
        Number(
            anime?.number_of_seasons
        );


    if(
        !Number.isFinite(
            quantidade
        ) ||
        quantidade <= 0
    ){

        return 0;

    }


    return quantidade;

}


/* =====================================================
   NÚMERO DE EPISÓDIOS
===================================================== */

function playNimeNumeroEpisodios(
    anime
){

    const quantidade =
        Number(
            anime?.number_of_episodes
        );


    if(
        !Number.isFinite(
            quantidade
        ) ||
        quantidade <= 0
    ){

        return 0;

    }


    return quantidade;

}


/* =====================================================
   SINOPSE
===================================================== */

function playNimeSinopse(
    anime
){

    return (

        anime?.overview ||

        "Sinopse não disponível."

    );

}


/* =====================================================
   EXPORTAÇÃO
===================================================== */

window.playNimeAPI =
    playNimeAPI;


window.playNimeImagem =
    playNimeImagem;


window.playNimeBanner =
    playNimeBanner;


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


window.playNimeAno =
    playNimeAno;


window.playNimeTemporada =
    playNimeTemporada;


window.playNimeNumeroTemporadas =
    playNimeNumeroTemporadas;


window.playNimeNumeroEpisodios =
    playNimeNumeroEpisodios;


window.playNimeSinopse =
    playNimeSinopse;

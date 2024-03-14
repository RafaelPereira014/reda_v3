'use strict';
const models = require('../models/index');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    /* const lastEl = await models.Term.findAll({
      limit: 1,
      order: [ [ 'id', 'DESC' ]]
    }); */

    /* const formatTax = await models.Taxonomy.findOne({
      where: {
        slug: {
          [Op.like]: 'formato_resources'
        }
      }
    });
    const systemTax = await models.Taxonomy.findOne({
      where: {
        slug: {
          [Op.like]: 'sistemas_apps'
        }
      }
    }); */
    const tecReq = await models.Taxonomy.findOne({
      where: {
        slug: {
          [Op.like]: 'tec_requirements_resources'
        }
      }
    });
    const toolsTax = await models.Taxonomy.findOne({
      where: {
        slug: {
          [Op.like]: 'categorias_tools'
        }
      }
    });
    const redaVersionsTax = await models.Taxonomy.findOne({
      where: {
        slug: {
          [Op.like]: 'versao_reda'
        }
      }
    });
    const scriptsDest = await models.Taxonomy.findOne({
      where: {
        slug: {
          [Op.like]: 'target_resources'
        }
      }
    });
    

    /* let counter = lastEl[0].id; */

    /* let insertEls = [
      {
        id:22,
        title: 'Aplicações',
        slug: 'apps',
        taxonomy_id: formatTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:23,
        title: 'Vídeo',
        slug: 'video',
        taxonomy_id: formatTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:24,
        title: 'Animação/Simulação',
        slug: 'animation',
        taxonomy_id: formatTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:25,
        title: 'Áudio',
        slug: 'audio',
        taxonomy_id: formatTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:26,
        title: 'Imagem',
        slug: 'image',
        taxonomy_id: formatTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:27,
        title: 'Texto',
        slug: 'text',
        taxonomy_id: formatTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:29,
        title: 'Folha de Cálculo',
        slug: 'calc',
        taxonomy_id: formatTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:30,
        title: 'Jogo Didático',
        slug: 'game',
        taxonomy_id: formatTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:31,
        title: 'Todos',
        slug: 'all',
        taxonomy_id: formatTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:32,
        title: 'iOS',
        slug: 'ios',
        icon: 'apple',
        taxonomy_id: systemTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:33,
        title: 'Android',
        slug: 'android',
        icon: 'android',
        taxonomy_id: systemTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:34,
        title: 'Windows',
        slug: 'windows',
        icon: 'windows',
        taxonomy_id: systemTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
    ]; */

    // ==========================================
    // Tools categories
    // ==========================================
    let insertEls = [];
    insertEls.push(
      {
        id:35,
        title: 'Sítios de interesse',
        slug: 'sitios-de-interesse',
        taxonomy_id: toolsTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:36,
        title: 'Tutoriais/Utilidades',
        slug: 'tutoriais-utilidades',
        taxonomy_id: toolsTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:37,
        title: 'Plataformas',
        slug: 'plataformas',
        taxonomy_id: toolsTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:38,
        title: 'Criação de recursos',
        slug: 'criacao-de-recursos',
        taxonomy_id: toolsTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
    )

    // Sitios de interesse
    insertEls.push(
      {
        id:39,
        title: 'Arte',
        slug: 'arte',
        taxonomy_id: toolsTax.id,
        parent_id: 35,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:40,
        title: 'Comunidades virtuais',
        slug: 'comunidades-virtuais',
        taxonomy_id: toolsTax.id,
        parent_id: 35,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:41,
        title: 'Blogs/Fóruns',
        slug: 'blogs-foruns',
        taxonomy_id: toolsTax.id,
        parent_id: 35,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:42,
        title: 'Dicionários/Enciclopédias',
        slug: 'dicionarios-enciclopedias',
        taxonomy_id: toolsTax.id,
        parent_id: 35,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:43,
        title: 'Documentos orientadores',
        slug: 'documentos-orientadores',
        taxonomy_id: toolsTax.id,
        parent_id: 35,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:44,
        title: 'Formação/e-Learning',
        slug: 'formacao-e-learning',
        taxonomy_id: toolsTax.id,
        parent_id: 35,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:45,
        title: 'Fundações/Museus/Bibliotecas',
        slug: 'fundacoes-museus-bibliotecas',
        taxonomy_id: toolsTax.id,
        parent_id: 35,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:46,
        title: 'Literacia',
        slug: 'literacia',
        taxonomy_id: toolsTax.id,
        parent_id: 35,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:47,
        title: 'Literatura',
        slug: 'literatura',
        taxonomy_id: toolsTax.id,
        parent_id: 35,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:48,
        title: 'Media',
        slug: 'media',
        taxonomy_id: toolsTax.id,
        parent_id: 35,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:49,
        title: 'Organizações/Instituições',
        slug: 'organizacoes-instituicoes',
        taxonomy_id: toolsTax.id,
        parent_id: 35,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:50,
        title: 'Divulgação científica',
        slug: 'divulgacao-cientifica',
        taxonomy_id: toolsTax.id,
        parent_id: 35,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:51,
        title: 'Computação e robótica',
        slug: 'computacao-e-robotica',
        taxonomy_id: toolsTax.id,
        parent_id: 35,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:52,
        title: 'Repositórios',
        slug: 'repositorios',
        taxonomy_id: toolsTax.id,
        parent_id: 35,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:53,
        title: 'Inglês',
        slug: 'repositorios-ingles',
        taxonomy_id: toolsTax.id,
        parent_id: 52,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:54,
        title: 'Física e Química',
        slug: 'repositorios-fisica-e-quimica',
        taxonomy_id: toolsTax.id,
        parent_id: 52,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:55,
        title: 'Cidadania',
        slug: 'repositorios-cidadania',
        taxonomy_id: toolsTax.id,
        parent_id: 52,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:56,
        title: 'Matemática',
        slug: 'repositorios-matematica',
        taxonomy_id: toolsTax.id,
        parent_id: 52,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:57,
        title: '1.º Ciclo',
        slug: 'repositorios-1-ciclo',
        taxonomy_id: toolsTax.id,
        parent_id: 52,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:58,
        title: 'História',
        slug: 'repositorios-historia',
        taxonomy_id: toolsTax.id,
        parent_id: 52,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:59,
        title: 'Artes',
        slug: 'repositorios-artes',
        taxonomy_id: toolsTax.id,
        parent_id: 52,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:60,
        title: 'Geografia',
        slug: 'repositorios-geografia',
        taxonomy_id: toolsTax.id,
        parent_id: 52,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:61,
        title: 'Português',
        slug: 'repositorios-portugues',
        taxonomy_id: toolsTax.id,
        parent_id: 52,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:62,
        title: 'Ciências',
        slug: 'repositorios-ciencias',
        taxonomy_id: toolsTax.id,
        parent_id: 52,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:63,
        title: 'Francês',
        slug: 'repositorios-frances',
        taxonomy_id: toolsTax.id,
        parent_id: 52,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:64,
        title: 'Educação Especial',
        slug: 'repositorios-educacao-especial',
        taxonomy_id: toolsTax.id,
        parent_id: 52,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:65,
        title: 'Espanhol',
        slug: 'repositorios-espanhol',
        taxonomy_id: toolsTax.id,
        parent_id: 52,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:66,
        title: 'Geral',
        slug: 'repositorios-geral',
        taxonomy_id: toolsTax.id,
        parent_id: 52,
        created_at: new Date(),
        updated_at: new Date()
      },
    );

    // Tutoriais / Utilidades
    insertEls.push(
      {
        id:67,
        title: 'Conversores',
        slug: 'tutoriais-conversores',
        taxonomy_id: toolsTax.id,
        parent_id: 36,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:68,
        title: 'Verificadores de plágio',
        slug: 'tutoriais-verificadores-de-plagio',
        taxonomy_id: toolsTax.id,
        parent_id: 36,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:69,
        title: 'Dicionários/Tradutores',
        slug: 'tutoriais-dicionarios-tradutores',
        taxonomy_id: toolsTax.id,
        parent_id: 36,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:70,
        title: 'Tutoriais',
        slug: 'tutoriais-tutoriais',
        taxonomy_id: toolsTax.id,
        parent_id: 36,
        created_at: new Date(),
        updated_at: new Date()
      },
    );

    // Plataformas
    insertEls.push(
      {
        id:71,
        title: 'Colaborativas',
        slug: 'plataformas-colaborativas',
        taxonomy_id: toolsTax.id,
        parent_id: 37,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:72,
        title: 'Comunicação',
        slug: 'plataformas-comunicacao',
        taxonomy_id: toolsTax.id,
        parent_id: 37,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:73,
        title: 'Gestão de projetos/sala de aula',
        slug: 'plataformas-gestao-projetos-sala-de-aula',
        taxonomy_id: toolsTax.id,
        parent_id: 37,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:74,
        title: 'e-Learning',
        slug: 'plataformas-e-learning',
        taxonomy_id: toolsTax.id,
        parent_id: 37,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:75,
        title: 'Repositórios',
        slug: 'plataformas-repositorios',
        taxonomy_id: toolsTax.id,
        parent_id: 37,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:76,
        title: 'Inglês',
        slug: 'plataformas-repositorios-ingles',
        taxonomy_id: toolsTax.id,
        parent_id: 75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:77,
        title: 'Física e Química',
        slug: 'plataformas-repositorios-fisica-e-quimica',
        taxonomy_id: toolsTax.id,
        parent_id: 75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:78,
        title: 'Cidadania',
        slug: 'plataformas-repositorios-cidadania',
        taxonomy_id: toolsTax.id,
        parent_id: 75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:79,
        title: 'Matemática',
        slug: 'plataformas-repositorios-matematica',
        taxonomy_id: toolsTax.id,
        parent_id: 75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:80,
        title: '1.º Ciclo',
        slug: 'plataformas-repositorios-1-ciclo',
        taxonomy_id: toolsTax.id,
        parent_id: 75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:81,
        title: 'História',
        slug: 'plataformas-repositorios-historia',
        taxonomy_id: toolsTax.id,
        parent_id: 75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:82,
        title: 'Artes',
        slug: 'plataformas-repositorios-artes',
        taxonomy_id: toolsTax.id,
        parent_id: 75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:83,
        title: 'Geografia',
        slug: 'plataformas-repositorios-geografia',
        taxonomy_id: toolsTax.id,
        parent_id: 75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:84,
        title: 'Português',
        slug: 'plataformas-repositorios-portugues',
        taxonomy_id: toolsTax.id,
        parent_id: 75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:85,
        title: 'Ciências',
        slug: 'plataformas-repositorios-ciencias',
        taxonomy_id: toolsTax.id,
        parent_id: 75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:86,
        title: 'Francês',
        slug: 'plataformas-repositorios-frances',
        taxonomy_id: toolsTax.id,
        parent_id: 75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:87,
        title: 'Educação Especial',
        slug: 'plataformas-repositorios-educacao-especial',
        taxonomy_id: toolsTax.id,
        parent_id: 75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:88,
        title: 'Espanhol',
        slug: 'plataformas-repositorios-espanhol',
        taxonomy_id: toolsTax.id,
        parent_id: 75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:89,
        title: 'Geral',
        slug: 'plataformas-repositorios-geral',
        taxonomy_id: toolsTax.id,
        parent_id: 75,
        created_at: new Date(),
        updated_at: new Date()
      },
    );

    // Criação de recursos
    insertEls.push(
      {
        id:90,
        title: 'Storytelling',
        slug: 'criacao-recursos-storytelling',
        taxonomy_id: toolsTax.id,
        parent_id: 38,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:91,
        title: 'Audiovisuais',
        slug: 'criacao-recursos-audiovisuais',
        taxonomy_id: toolsTax.id,
        parent_id: 38,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:92,
        title: 'Diagramas/Esquemas',
        slug: 'criacao-recursos-diagramas-esquemas',
        taxonomy_id: toolsTax.id,
        parent_id: 38,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:93,
        title: 'Simulações',
        slug: 'criacao-recursos-simulacoes',
        taxonomy_id: toolsTax.id,
        parent_id: 38,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:94,
        title: 'Jogos/Puzzles',
        slug: 'criacao-recursos-jogos-puzzles',
        taxonomy_id: toolsTax.id,
        parent_id: 38,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:95,
        title: 'Avaliação',
        slug: 'criacao-recursos-avaliacao',
        taxonomy_id: toolsTax.id,
        parent_id: 38,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:96,
        title: 'Apresentações',
        slug: 'criacao-recursos-apresentacoes',
        taxonomy_id: toolsTax.id,
        parent_id: 38,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id:97,
        title: 'Currículo',
        slug: 'criacao-recursos-curriculo',
        taxonomy_id: toolsTax.id,
        parent_id: 38,
        created_at: new Date(),
        updated_at: new Date()
      },
    );

    /**
     * MORE GENERIC
     */
    insertEls.push(
      {
        id: 98,
        title: 'v3',
        slug: 'v3-version',
        taxonomy_id: redaVersionsTax.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 99,
        title: 'Alunos',
        slug: 'alunos-dest',
        taxonomy_id: scriptsDest.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 100,
        title: 'Docentes',
        slug: 'docentes-dest',
        taxonomy_id: scriptsDest.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 101,
        title: 'Outros',
        slug: 'outros-dest',
        taxonomy_id: scriptsDest.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 102,
        title: 'Adobe Flash Player',
        slug: 'adobe_flash_player_tec_req',
        taxonomy_id: tecReq.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 103,
        title: 'Adobe Shockwave Player',
        slug: 'adobe_shockwave_player_tec_req',
        taxonomy_id: tecReq.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 104,
        title: '7zip',
        slug: '7zip_tec_req',
        taxonomy_id: tecReq.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 105,
        title: 'Folha de Cálculo',
        slug: 'folha_de_calculo_tec_req',
        taxonomy_id: tecReq.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 106,
        title: 'GeoGebra',
        slug: 'geogebra_tec_req',
        taxonomy_id: tecReq.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 107,
        title: 'Java',
        slug: 'java_tec_req',
        taxonomy_id: tecReq.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 108,
        title: 'Leitor de vídeo (e.g., VLC Media Player)',
        slug: 'leitor_video_tec_req',
        taxonomy_id: tecReq.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 109,
        title: 'Colunas de áudio',
        slug: 'colunas_audio_tec_req',
        taxonomy_id: tecReq.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 110,
        title: 'Leitor de áudio (e.g., AVI, Windows Media Player)',
        slug: 'leitor_audio_tec_req',
        taxonomy_id: tecReq.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 111,
        title: 'Processador de texto',
        slug: 'processador_de_texto_tec_req',
        taxonomy_id: tecReq.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 112,
        title: 'Visualizador de imagem',
        slug: 'visualizador_de_imagem_tec_req',
        taxonomy_id: tecReq.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 113,
        title: 'N/A',
        slug: 'n_a_tec_req',
        taxonomy_id: tecReq.id,
        created_at: new Date(),
        updated_at: new Date()
      },
    );
	
    /* insertEls.map( el => {
      el.id = ++counter;
    }) */

    return queryInterface.bulkInsert('Terms', insertEls,
    {
      updateOnDuplicate: [
        'title',
        'slug',
        'taxonomy_id',
        'created_at',
        'updated_at'
      ],
    }
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};

var Converter = require("csvtojson").Converter;
var iconv = require('iconv-lite');
var crypto = require('crypto');

// ROLES
var createRoles = function(models){
  return models.Role.create({value: "Admin", type: "admin"})
  .then(function(){
    return models.Role.create({value: "User", type: "user"})
  });
}

// USERS
var createUsers = function(models){
  return models.User.bulkCreate([
    {
      email: "tec.reda@azores.gov.pt",
      password: "$2a$10$W5zcmgJoZzQKZHgPdV0W..95QX6.5zsjGRTPOKk2hBSyLh/QApfHS",
      name: "Técnico da REDA",
      organization: "REDA",
      approved: 1,
      status: true,
      role_id: 1
    },
    {
      email: "reda.user@edu.azores.gov.pt",
      password: "$2a$10$kP/8k1V3AVJn/Ikdj72lnenJvxRNO/ScGzIEoj3.oTkRjybSQiqjG",
      name: "Utilizador REDA",
      organization: "REDA",
      approved: 1,
      status: true,
      role_id: 2
    },
    {
      email: "dre.rea@edu.azores.gov.pt",
      password: "$2a$10$6ttcxDD/v.WOFgBr4a7CSu78edNvYFgnnsjP.HzEL./hVPra6Xvie",
      name: "Equipa REDA",
      organization: "REDA",
      approved: 1,
      status: true,
      role_id: 1
    }
  ])
}

// FORMATS
var createFormats = function(models){
  return models.Format.create({
    title: "Vídeo",
    type: "video",
    priority: 1,
    color:"#ff9900",
    Image: {
      name: "video",
      extension: "svg"
    }
  }, {
    include: [ models.Image ]
  })
  /*.then(function(){
    return models.Format.create({
        title: "Simulação",
        type: "simulation",
        priority: 0,
        color:"",
        Image: {
          name: "simulacao",
          extension: "svg"
        }
      }, {
      include: [ models.Image ]
    })
  })*/
  .then(function(){
    return models.Format.create({
        title: "Animação/Simulação",
        type: "animation",
        priority: 2,
        color:"#ff3300",
        Image: {
          name: "animacao",
          extension: "svg"
        }
      }, {
      include: [ models.Image ]
    })
  })
  .then(function(){
    return models.Format.create({
      title: "Áudio",
      type: "audio",
      priority: 3,
      color:"#33cc33",
      Image: {
        name: "audio",
        extension: "svg"
      }
    }, {
    include: [ models.Image ]
  })
  })
  .then(function(){
    return models.Format.create({
      title: "Imagem",
      type: "image",
      priority: 4,
      color:"#0066ff",
      Image: {
        name: "imagem",
        extension: "svg"
      }
    }, {
    include: [ models.Image ]
  })
  })
  .then(function(){
    return models.Format.create({
      title: "Texto",
      type: "text",
      priority: 8,
      color:"#996633",
      Image: {
        name: "texto",
        extension: "svg"
      }
    }, {
    include: [ models.Image ]
  })
  })
  .then(function(){
    return models.Format.create({
      title: "Folha de Cálculo",
      type: "calc",
      priority: 5,
      color:"#666699",
      Image: {
        name: "folha_calculo",
        extension: "svg"
      }
    }, {
    include: [ models.Image ]
  })
  })
  .then(function(){
    return models.Format.create({
      title: "Jogo Didático",
      type: "game",
      priority: 7,
      color:"#6a696a",
      Image: {
        name: "jogo_didatico",
        extension: "svg"
      }
    }, {
    include: [ models.Image ]
  })
  })
  .then(function(){
    return models.Format.create({
      title: "Todos",
      type: "all",
      priority: 6,
      color:"",
      Image: {
        name: "outros",
        extension: "svg"
      }
    }, {
    include: [ models.Image ]
  });
  });
}

// MODES
var createMode = function(models){
  return models.Mode.create({
    title: "Online",
    type: "online"
  })
  .then(function(){
    return models.Mode.create({
    title: "Descarregável",
    type: "downloadable"
  });
  });
}

// SUBJECTS
var createSubjects = function(models){
  return models.Subject.create({
    title: "Matemática",
    Domains: [
      { title: "Números e Operações" },
      { title: "Geometria e Medida" },
      { title: "Funções, Sequências e Sucessões" },
      { title: "Álgebra" },
      { title: "Organização e Tratamento de Dados" },
    ] 
  },{
    include: [ models.Domain ]
  })
  .then(function(){

    return models.Subject.create({
      title: "Português",
      Domains: [
        { title: "Oralidade" },
        { title: "Leitura" },
        { title: "Escrita" },
        { title: "Iniciação à educação literária" },
        { title: "Educação literária" },
        { title: "Gramática" },
        { title: "História da língua" }
      ]
    },{
      include: [ models.Domain ]
    })
    /*.then((item) => {
      item.addDomains([6])
    })*/
  })
  .then(function(){

    return models.Subject.create({
      title: "Ciências Físico-Químicas",
      Domains: [
        { title: "Espaço" },
        { title: "Materiais" },
        { title: "Energia" },
        { title: "Reações químicas" },
        { title: "Som" },
        { title: "Luz" },
        { title: "Movimento e Forças" },
        { title: "Forças" },
        { title: "Eletricidade" },
        { title: "Classificação dos materiais" },
      ]
    },{
      include: [ models.Domain ]
    })
    /*.then((item) => {
      item.addDomains([6])
    })*/
  })
  .then(function(){

    return models.Subject.create({
      title: "Ciências Naturais",
      Domains: [
        { title: "A água, o ar, as rochas e o solo – materiais terrestres" },
        { title: "Diversidade de seres vivos e suas interações com o meio" },
        { title: "Unidade na diversidade de seres vivos" },
        { title: "PROCESSOS vitais comuns aos seres vivos" },
        { title: "Processos vitais comuns aos seres vivos" },
        { title: "Terra em transformação" },
        { title: "Terra – um planeta com vida" },
        { title: "Sustentabilidade na terra" },
        { title: "Viver melhor na terra" }
      ]
    },{
      include: [ models.Domain ]
    })
  })
  .then(function(){

    return models.Subject.create({
      title: "Cidadania",
      Domains: [
        { title: "A Pessoa como Agente Ético-Moral" },
        { title: "Educação para os Direitos Humanos" },
        { title: "Educação para a alimentação" },
        { title: "Educação Ambiental" },
        { title: "Educação para a Segurança" },
        { title: "Educação para o Consumo" },
        { title: "Educação para a Sociedade da Informação" },
        { title: "Educação para a Preservação do Património Histórico-Cultural" },
        { title: "Educação para o Empreendedorismo" },
        { title: "Questões Éticas da Actualidade" }
      ]
    },{
      include: [ models.Domain ]
    })
  })
  .then(function(){

    return models.Subject.bulkCreate([
      {
        title: "Estudo do Meio"
      },
      {
        title: "TIC"
      },
      {
        title: "Inglês"
      },
      {
        title: "Outras"
      }
    ]);
  });
}

// DOMAINS
var createDomains = function(models){
  return models.Domain.bulkCreate([
    {
      title: "Oralidade"
    },
    {
      title: "Leitura"
    },
    {
      title: "Escrita"
    },
    {
      title: "Iniciação à educação literária"
    },
    {
      title: "Cidadania"
    },
    {
      title: "TIC"
    },
    {
      title: "Inglês"
    },
    {
      title: "Outros"
    }
  ]);
}

// LANGUAGES
var createLanguages = function(models){
  return models.Language.bulkCreate([
    {
      title: "Português (PT)"
    },
    {
      title: "Português (BR)"
    },
    {
      title: "Inglês"
    },
    {
      title: "Inglês, legendado em português"
    },
    {
      title: "Castelhano"
    },
    {
      title: "Castelhano, legendado em português"
    },
    {
      title: "Francês"
    },
    {
      title: "Francês, legendado em português"
    },
    {
      title: "Não se aplica"
    },
    {
      title: "Outros, legendado em português"
    },
    {
      title: "Outros"
    }
  ]);
}

// YEARS
var createYears = function(models){
  return models.Year.bulkCreate([
    {
      title: "1.º"
    },
    {
      title: "2.º"
    },
    {
      title: "3.º"
    },
    {
      title: "4.º"
    },
    {
      title: "5.º"
    },
    {
      title: "6.º"
    },
    {
      title: "7.º"
    },
    {
      title: "8.º"
    },
    {
      title: "9.º"
    }
  ]);
}

// Tags
var createTags = function(models){
  return models.Tag.bulkCreate([
    {
      title: "Tag1"
    },
    {
      title: "Tag2"
    },
    {
      title: "Tag3"
    }
  ]);
}

// Themes
var createThemes = function(models){
  return models.Theme.bulkCreate([
    {
      title: "Ciência",
      type: "APPS"
    },
    {
      title: "Cultura Geral",
      type: "APPS"
    },
    {
      title: "Educação",
      type: "APPS"
    },
    {
      title: "Física",
      type: "APPS"
    },
    {
      title: "Formação",
      type: "APPS"
    },
    {
      title: "Gestão de Trabalho",
      type: "APPS"
    },
    {
      title: "Língua portuguesa",
      type: "APPS"
    },
    {
      title: "Línguas",
      type: "APPS"
    },
    {
      title: "Matemática",
      type: "APPS"
    },
    {
      title: "Notícias",
      type: "APPS"
    },
    {
      title: "Química",
      type: "APPS"
    },
    {
      title: "Literatura",
      type: "APPS"
    },
    {
      title: "Biologia",
      type: "APPS"
    },
    {
      title: "Geologia",
      type: "APPS"
    }
  ]);
}

// Cat Apps
var createCatApps = function(models){
  return models.Category.bulkCreate([
    {
      title: "Mais acedidas",
      type: "APPS"
    },
    {
      title: "Curiosidades",
      type: "APPS"
    },
    {
      title: "Interessantes",
      type: "APPS"
    },
    {
      title: "Jogos",
      type: "APPS"
    }
  ]);
}

// Cat Recomended
var createCatRecomended = function(models){
  return models.Category.bulkCreate([
    {
      title: "Arte",
      type: "REC"
    },
    {
      title: "Blogues",
      type: "REC"
    },
    {
      title: "Comunidades virtuais e Redes Sociais",
      type: "REC"
    },
    {
      title: "Curiosidades",
      type: "REC"
    },
    {
      title: "Dicionários e Enciclopédias",
      type: "REC"
    },
    {
      title: "Documentos orientadores",
      type: "REC"
    },
    {
      title: "Formação",
      type: "REC"
    },
    {
      title: "Fundações e Museus",
      type: "REC"
    },
    {
      title: "Literacia",
      type: "REC"
    },
    {
      title: "Literatura",
      type: "REC"
    },
    {
      title: "Media",
      type: "REC"
    },
    {
      title: "Organizações e Instituições",
      type: "REC"
    },
    {
      title: "Produção de recursos",
      type: "REC"
    },
    {
      title: "Repositórios",
      type: "REC"
    },
    {
      title: "Texto científico",
      type: "REC"
    },
    {
      title: "TIC",
      type: "REC"
    }
  ]);
}

// Cat "Experimenta"
var createCatTry = function(models){
  return models.Category.bulkCreate([
    {
      title: "Mais acedidas",
      type: "TRY"
    },
    {
      title: "Curiosidades",
      type: "TRY"
    },
    {
      title: "Interessantes",
      type: "TRY"
    },
    {
      title: "Jogos",
      type: "TRY"
    }
  ]);
}

// Cycles
var createCycles = function(models){
  return models.Cycle.bulkCreate([
    {
      title: "1º Ciclo",
      type: "REC"
    },
    {
      title: "2º Ciclo",
      type: "REC"
    },
    {
      title: "3º Ciclo",
      type: "REC"
    },
    {
      title: "Secundário",
      type: "REC"
    },
    {
      title: "1º Ciclo",
      type: "TRY"
    },
    {
      title: "2º Ciclo",
      type: "TRY"
    },
    {
      title: "3º Ciclo",
      type: "TRY"
    },
    {
      title: "Secundário",
      type: "TRY"
    }
  ]);
}

// System
var createSystem = function(models){
  return models.System.bulkCreate([
    {
      title: "iOS",
      icon: "apple"
    },
    {
      title: "Android",
      icon: "android"
    },
    {
      title: "Windows",
      icon: "windows"
    }
  ]);
}

// Bad words list
var createBadwords = function(models){
  var converter = new Converter({
    headers: ['title']
  });

  //read from file 
  require("fs")
  .createReadStream(__dirname+"/csv/bad-words.csv")
  .pipe(iconv.decodeStream('utf8'))
  .pipe(converter);

  //end_parsed will be emitted once parsing finished 
  converter.on("end_parsed", function (wordsList) {
     return models.Badword.bulkCreate(wordsList);
  });
}

// Create user tokens based on CSV file
var createUsersTokens = function(models){

  var converter = new Converter({
    headers: ['title']
  });

  //read from file 
  require("fs")
  .createReadStream(__dirname+"/csv/bad-words.csv")
  .pipe(iconv.decodeStream('utf8'))
  .pipe(converter);

  //end_parsed will be emitted once parsing finished 
  converter.on("end_parsed", function (wordsList) {
    var tokensList = [];
    var curData = {};

    // Go for data in list
    for (el of wordsList){
      curData = {};

      crypto.randomBytes(48, function(err, buffer) {
        curData.token = buffer.toString('hex');
        tokensList.push(curData);
      });     
    }

    return models.Registration.bulkCreate(tokensList);
     
  });

}

exports.createResource = function(models){
  return models.Resource.create({
    title: "Media heading",
    slug: "media-heading-3",
    description: "Are you one of the thousands of Iphone owners who has no idea that they can get free games for their Iphone? It’s pretty cool to download things from Itunes, but with a little research you can find thousands of other places to download from",
    format_id: 1,
    author:" Luis Melo",
    organization: "Escola X",
    email: "geral@luisfbmelo.com",
    highlight: false,
    exclusive: false,
    embed: "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/eIho2S0ZahI\" frameborder=\"0\" allowfullscreen></iframe>",
    techResources: "asd",
    operation: "asdasd",
    operation_author: "asdasdasd",
    user_id: 1
  },{
    include: [ models.Domain, models.Subject, models.Year, models.Mode, models.Language ]
  }).then(function(item){
    item.setSubjects([
      1,
      2
    ]);

    item.setDomains([
      1,
      2
    ]);

    item.setYears([
      1,
      2
    ]);

    item.setModes([
      1
    ]);

    item.setLanguages([
      1
    ]);

    item.setTags([
      1,
      2
    ]);

    item.setFavorites([
      1
    ])

  })
  .catch(function(err){
    console.log(err);
  });
}

exports.createData = function(models){
  createRoles(models)
  .then(createFormats(models))
  .then(createMode(models))
  .then(createSubjects(models))
  .then(createLanguages(models))
  .then(createYears(models))
  .then(createThemes(models))
  .then(createCatApps(models))
  .then(createCatRecomended(models))
  .then(createCatTry(models))
  .then(createSystem(models))
  .then(createCycles(models))
  .then(createBadwords(models));

  //.then(createTags(models));
  //.then(createResource(models));
}

exports.createUsers = function(models){
  createUsers(models);
}
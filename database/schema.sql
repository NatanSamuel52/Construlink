-- CONSTRULINK
-- Estrutura do Banco de Dados
-- SCRUM-188


-- TABELA: usuario

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(),
    data_atualizacao TIMESTAMP NOT NULL DEFAULT NOW()
);


-- TABELA: cliente

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    id_usuario INTEGER UNIQUE NOT NULL,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    data_nascimento DATE,
    endereco VARCHAR(255),
    data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(),
    data_atualizacao TIMESTAMP NOT NULL DEFAULT NOW(),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);


-- TABELA: profissional

CREATE TABLE profissional (
    id_profissional SERIAL PRIMARY KEY,
    id_usuario INTEGER UNIQUE NOT NULL,
    nome_fantasia VARCHAR(150) NOT NULL,
    cnpj_cpf VARCHAR(18) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    biografia TEXT,
    foto_perfil VARCHAR(255),
    avaliacao_media NUMERIC(3,2) DEFAULT 0,
    total_avaliacoes INTEGER DEFAULT 0,
    data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(),
    data_atualizacao TIMESTAMP NOT NULL DEFAULT NOW(),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);


-- TABELA: administrador

CREATE TABLE administrador (
    id_administrador SERIAL PRIMARY KEY,
    id_usuario INTEGER UNIQUE NOT NULL,
    nivel_acesso VARCHAR(20) NOT NULL,
    data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(),
    data_atualizacao TIMESTAMP NOT NULL DEFAULT NOW(),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);


-- TABELA: categoria

CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo'
);


-- TABELA: servico

CREATE TABLE servico (
    id_servico SERIAL PRIMARY KEY,
    id_profissional INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    preco_referencia NUMERIC(10,2),
    tempo_estimado INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo',
    data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(),
    data_atualizacao TIMESTAMP NOT NULL DEFAULT NOW(),

    FOREIGN KEY (id_profissional)
        REFERENCES profissional(id_profissional)
        ON DELETE CASCADE,

    FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria)
        ON DELETE RESTRICT
);

-- TABELA: solicitacao

CREATE TABLE solicitacao (
    id_solicitacao SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    id_profissional INTEGER NOT NULL,
    id_servico INTEGER NOT NULL,
    mensagem TEXT,
    status VARCHAR(20) NOT NULL,
    data_solicitacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_resposta TIMESTAMP,
    data_conclusao TIMESTAMP,
    valor_negociado NUMERIC(10,2),

    FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
        ON DELETE CASCADE,

    FOREIGN KEY (id_profissional)
        REFERENCES profissional(id_profissional)
        ON DELETE CASCADE,

    FOREIGN KEY (id_servico)
        REFERENCES servico(id_servico)
        ON DELETE RESTRICT
);


-- TABELA: avaliacao

CREATE TABLE avaliacao (
    id_avaliacao SERIAL PRIMARY KEY,
    id_solicitacao INTEGER UNIQUE NOT NULL,
    id_cliente INTEGER NOT NULL,
    id_profissional INTEGER NOT NULL,
    nota SMALLINT NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    data_avaliacao TIMESTAMP NOT NULL DEFAULT NOW(),

    FOREIGN KEY (id_solicitacao)
        REFERENCES solicitacao(id_solicitacao)
        ON DELETE CASCADE,

    FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
        ON DELETE CASCADE,

    FOREIGN KEY (id_profissional)
        REFERENCES profissional(id_profissional)
        ON DELETE CASCADE
);


-- TABELA: portfolio

CREATE TABLE portfolio (
    id_portfolio SERIAL PRIMARY KEY,
    id_profissional INTEGER NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    url_imagem VARCHAR(255),
    ordem INTEGER DEFAULT 0,
    data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(),

    FOREIGN KEY (id_profissional)
        REFERENCES profissional(id_profissional)
        ON DELETE CASCADE
);


-- TABELA: favorito

CREATE TABLE favorito (
    id_favorito SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    id_profissional INTEGER NOT NULL,
    data_adicao TIMESTAMP NOT NULL DEFAULT NOW(),

    FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
        ON DELETE CASCADE,

    FOREIGN KEY (id_profissional)
        REFERENCES profissional(id_profissional)
        ON DELETE CASCADE,

    UNIQUE (id_cliente, id_profissional)
);


-- TABELA: denuncia

CREATE TABLE denuncia (
    id_denuncia SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    id_profissional INTEGER NOT NULL,
    motivo VARCHAR(150) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    data_denuncia TIMESTAMP NOT NULL DEFAULT NOW(),
    data_resolucao TIMESTAMP,

    FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
        ON DELETE CASCADE,

    FOREIGN KEY (id_profissional)
        REFERENCES profissional(id_profissional)
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS conversa_leitura (
    conversa_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    ultima_mensagem_lida_id BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (conversa_id, usuario_id),
    CONSTRAINT fk_conversa_leitura_conversa
        FOREIGN KEY (conversa_id)
        REFERENCES conversa(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_conversa_leitura_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
        ON DELETE CASCADE
);

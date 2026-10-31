CREATE DATABASE IF NOT EXISTS Egresados_bd CHARACTER SET utf8mb4;
USE Egresados_bd;

CREATE TABLE IF NOT EXISTS Promocion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    anio INT NOT NULL,
    colegio VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombreUsuario VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    email VARCHAR(255),
    rol VARCHAR(255),
    promocion_id BIGINT,
    FOREIGN KEY (promocion_id) REFERENCES Promocion(id)
);

CREATE TABLE IF NOT EXISTS Evento (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(255),
    nombre VARCHAR(255),
    fecha VARCHAR(255),
    lugar VARCHAR(255),
    precio DOUBLE NOT NULL,
    descripcion VARCHAR(255),
    imagen VARCHAR(255),
    promocion_id BIGINT,
    FOREIGN KEY (promocion_id) REFERENCES Promocion(id)
);

CREATE TABLE IF NOT EXISTS Aviso (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255),
    contenido VARCHAR(255),
    fechaPublicacion VARCHAR(255),
    promocion_id BIGINT,
    FOREIGN KEY (promocion_id) REFERENCES Promocion(id)
);

CREATE TABLE IF NOT EXISTS Empresa (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(255),
    nombre VARCHAR(255),
    ubicacion VARCHAR(255),
    capacidad VARCHAR(255),
    precioDesde DOUBLE NOT NULL,
    precioHasta DOUBLE NOT NULL,
    descripcion VARCHAR(255),
    servicios VARCHAR(255),
    imagen VARCHAR(255),
    link VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Usuario_Evento (
    Usuario_id BIGINT NOT NULL,
    Evento_id BIGINT NOT NULL,
    PRIMARY KEY (Usuario_id, Evento_id),
    FOREIGN KEY (Usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (Evento_id) REFERENCES Evento(id)
);


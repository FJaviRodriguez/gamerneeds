-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema gamerneeds
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema gamerneeds
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `gamerneeds` DEFAULT CHARACTER SET utf8 ;
USE `gamerneeds` ;

-- -----------------------------------------------------
-- Table `gamerneeds`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamerneeds`.`usuario` (
  `idusuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellidos` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `direccion` VARCHAR(45) NOT NULL,
  `rol` VARCHAR(45) NOT NULL,
  `fecha_registro` DATE NOT NULL,
  `avatar` VARCHAR(45) NOT NULL,
  `descripcion` LONGTEXT NOT NULL,
  PRIMARY KEY (`idusuario`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gamerneeds`.`juego`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamerneeds`.`juego` (
  `idjuego` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  `precio` DECIMAL NOT NULL,
  `fecha_lanzamiento` DATE NOT NULL,
  `clasificacion_edad` INT NOT NULL,
  `url_trailer` VARCHAR(45) NOT NULL,
  `url_portada` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idjuego`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gamerneeds`.`genero`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamerneeds`.`genero` (
  `idgenero` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idgenero`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gamerneeds`.`desarrollador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamerneeds`.`desarrollador` (
  `iddesarrollador` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `sitio_web` VARCHAR(45) NOT NULL,
  `fecha_fundacion` DATE NOT NULL,
  PRIMARY KEY (`iddesarrollador`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gamerneeds`.`editor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamerneeds`.`editor` (
  `ideditor` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `sitio_web` VARCHAR(45) NOT NULL,
  `fecha_fundacion` DATE NOT NULL,
  PRIMARY KEY (`ideditor`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gamerneeds`.`resenia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamerneeds`.`resenia` (
  `idresenia` INT NOT NULL AUTO_INCREMENT,
  `puntuacion` VARCHAR(45) NOT NULL,
  `comentario` VARCHAR(45) NOT NULL,
  `fecha_comentario` DATE NOT NULL,
  `usuario_idusuario` INT NOT NULL,
  `juego_idjuego` INT NOT NULL,
  PRIMARY KEY (`idresenia`),
  CONSTRAINT `fk_resenia_usuario1`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `gamerneeds`.`usuario` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_resenia_juego1`
    FOREIGN KEY (`juego_idjuego`)
    REFERENCES `gamerneeds`.`juego` (`idjuego`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gamerneeds`.`foro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamerneeds`.`foro` (
  `idforo` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  `fecha_creacion` DATE NOT NULL,
  PRIMARY KEY (`idforo`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gamerneeds`.`biblioteca`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamerneeds`.`biblioteca` (
  `usuario_idusuario` INT NOT NULL,
  `juego_idjuego` INT NOT NULL,
  PRIMARY KEY (`usuario_idusuario`, `juego_idjuego`),
  CONSTRAINT `fk_usuario_has_juego_usuario`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `gamerneeds`.`usuario` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuario_has_juego_juego1`
    FOREIGN KEY (`juego_idjuego`)
    REFERENCES `gamerneeds`.`juego` (`idjuego`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `gamerneeds`.`compra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamerneeds`.`compra` (
  `idcompra` INT NOT NULL AUTO_INCREMENT,
  `fecha_compra` VARCHAR(45) NOT NULL,
  `total` DECIMAL NOT NULL,
  `estado_pago` VARCHAR(45) NOT NULL,
  `usuario_idusuario` INT NOT NULL,
  PRIMARY KEY (`idcompra`),
  CONSTRAINT `fk_compra_usuario1`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `gamerneeds`.`usuario` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `gamerneeds`.`compra_has_juego`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamerneeds`.`compra_has_juego` (
  `compra_idcompra` INT NOT NULL,
  `juego_idjuego` INT NOT NULL,
  `precio_unitario` DECIMAL NOT NULL,
  PRIMARY KEY (`compra_idcompra`, `juego_idjuego`),
  CONSTRAINT `fk_compra_has_juego_compra1`
    FOREIGN KEY (`compra_idcompra`)
    REFERENCES `gamerneeds`.`compra` (`idcompra`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_compra_has_juego_juego1`
    FOREIGN KEY (`juego_idjuego`)
    REFERENCES `gamerneeds`.`juego` (`idjuego`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- Table `gamerneeds`.`juego_has_genero`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamerneeds`.`juego_has_genero` (
  `juego_idjuego` INT NOT NULL,
  `genero_idgenero` INT NOT NULL,
  PRIMARY KEY (`juego_idjuego`, `genero_idgenero`),
  CONSTRAINT `fk_juego_has_genero_juego1`
    FOREIGN KEY (`juego_idjuego`)
    REFERENCES `gamerneeds`.`juego` (`idjuego`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_juego_has_genero_genero1`
    FOREIGN KEY (`genero_idgenero`)
    REFERENCES `gamerneeds`.`genero` (`idgenero`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `gamerneeds`.`juego_has_desarrollador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamerneeds`.`juego_has_desarrollador` (
  `juego_idjuego` INT NOT NULL,
  `desarrollador_iddesarrollador` INT NOT NULL,
  PRIMARY KEY (`juego_idjuego`, `desarrollador_iddesarrollador`),
  CONSTRAINT `fk_juego_has_desarrollador_juego1`
    FOREIGN KEY (`juego_idjuego`)
    REFERENCES `gamerneeds`.`juego` (`idjuego`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_juego_has_desarrollador_desarrollador1`
    FOREIGN KEY (`desarrollador_iddesarrollador`)
    REFERENCES `gamerneeds`.`desarrollador` (`iddesarrollador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gamerneeds`.`editor_has_juego`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamerneeds`.`editor_has_juego` (
  `editor_ideditor` INT NOT NULL,
  `juego_idjuego` INT NOT NULL,
  PRIMARY KEY (`editor_ideditor`, `juego_idjuego`),
  CONSTRAINT `fk_editor_has_juego_editor1`
    FOREIGN KEY (`editor_ideditor`)
    REFERENCES `gamerneeds`.`editor` (`ideditor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_editor_has_juego_juego1`
    FOREIGN KEY (`juego_idjuego`)
    REFERENCES `gamerneeds`.`juego` (`idjuego`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gamerneeds`.`foro_has_juego`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamerneeds`.`foro_has_juego` (
  `foro_idforo` INT NOT NULL,
  `juego_idjuego` INT NOT NULL,
  `usuario_idusuario` INT NOT NULL,
  PRIMARY KEY (`foro_idforo`, `juego_idjuego`, `usuario_idusuario`),
  CONSTRAINT `fk_foro_has_juego_foro1`
    FOREIGN KEY (`foro_idforo`)
    REFERENCES `gamerneeds`.`foro` (`idforo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_foro_has_juego_juego1`
    FOREIGN KEY (`juego_idjuego`)
    REFERENCES `gamerneeds`.`juego` (`idjuego`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_foro_has_juego_usuario1`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `gamerneeds`.`usuario` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

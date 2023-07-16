let bolaImagem;
let jogadorImagem;
let computadorImagem;
let fundoJogo;
let quicarSom;
let golSom;
let pontosJogador = 0;
let pontosComputador = 0;

class Raquete {
  constructor(x) {
    this.x = x;
    this.y = height / 2;
    this.w = 10;
    this.h = 60;
  }

  update() {
    if (this.x < width / 2) {
      this.y = mouseY;
    } else {
      if (this.y > bola.y) {
        this.y -= 5;
      } else {
        this.y += 5;
      }
    }

    if (this.y < 0) {
      this.y = this.h / 2;
    }
    if (this.y > height - this.h) {
      this.y = height - this.h;
    }
  }

  desenhar() {
    if (this.x < width / 2) {
      image(
        jogadorImagem,
        this.x - this.w / 2,
        this.y - this.h / 2,
        this.w,
        this.h
      );
    } else {
      image(
        computadorImagem,
        this.x - this.w / 2,
        this.y - this.h / 2,
        this.w,
        this.h
      );
    }
  }
}

class Bola {
  constructor() {
    this.r = 12;
    this.reset();
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.a = 0;
    this.vx = Math.random() * 10 - 5;
    this.vy = Math.random() * 10 - 5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.a += Math.sqrt(this.vx * this.vx + this.vy * this.vy) / 10;

    if (this.x < this.r || this.x > width - this.r) {
      if (this.x < this.r) {
        pontosComputador++;
      } else {
        pontosJogador++;
      }

      golSom.play();
      falaPontos();
      this.reset();
    }

    if (this.y < this.r || this.y > height - this.r) {
      this.vy *= -1;
    }

    const colideNoXComputador =
      this.x + this.r > computador.x &&
      this.x + this.r < computador.x + computador.w;

    const colideNoJogador =
      this.x - this.r > jogador.x && this.x - this.r < jogador.x + jogador.w;

    const colideNoX = colideNoXComputador || colideNoJogador;

    const colideNoY =
      this.y + this.r >= jogador.y && this.y - this.r <= jogador.y + jogador.h;

    if (
      colideRetanguloCirculo(
        this.x,
        this.y,
        this.r,
        jogador.x,
        jogador.y,
        jogador.w,
        jogador.h
      ) ||
      colideRetanguloCirculo(
        this.x,
        this.y,
        this.r,
        computador.x,
        computador.y,
        computador.w,
        computador.h
      )
    ) {
      this.vx *= -1;
      this.vx *= 1.1;
      this.vy *= 1.1;
      quicarSom.play();
    }
  }

  desenhar() {
    push();
    translate(this.x, this.y);
    rotate(this.a);
    imageMode(CENTER);
    image(bolaImagem, 0, 0, this.r * 2, this.r * 2);
    pop();
  }
}

function colideRetanguloCirculo(cx, cy, raio, rx, ry, rw, rh) {
  if (cx + raio < rx || cx - raio > rx + rw) {
    return false;
  }

  if (cy + raio < ry || cy - raio > ry + rh) {
    return false;
  }

  return true;
}

let x = 200;
let y = 200;
const r = 25;

let bola;
let jogador;
let computador;

function falaPontos() {
  if ("speechSynthesis" in window) {
    const fala = new SpeechSynthesisUtterance();
    fala.lang = "pt-BR";
    fala.text = `Jogador ${pontosJogador} Computador ${pontosComputador}`;
    window.speechSynthesis.speak(fala);
  }
}

function preload() {
  bolaImagem = loadImage("./Sprites/bola.png");
  jogadorImagem = loadImage("./Sprites/barra01.png");
  computadorImagem = loadImage("./Sprites/barra02.png");
  fundoJogo = loadImage("./Sprites/fundo1.png");
  quicarSom = loadSound("./sounds/446100__justinvoke__bounce.wav");
  golSom = loadSound(
    "./sounds/274178__littlerobotsoundfactory__jingle_win_synth_02.wav"
  );
}

function setup() {
  createCanvas(800, 400);
  bola = new Bola();
  jogador = new Raquete(30);
  computador = new Raquete(width - 30 - 10);
}

function draw() {
  image(fundoJogo, 0, 0, width, height);

  bola.update();
  bola.desenhar();

  jogador.update();
  jogador.desenhar();

  computador.update();
  computador.desenhar();
}

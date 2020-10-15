'use strict';

const GRID_SIZE = 5;
const NUMBER_FO_MINES = 2;

class Cell{
  constructor(displayableValue) {
    this.isVisible = false;
    this.isFlaged = false;
    this.displayableValue = displayableValue;
  }

  toString() {
    if (this.isVisible) {
      return this.displayableValue;
    } else if (this.isFlaged) {
      return '⚐';
    } else {
      return '🀆';
    }
  };
}

export class Mine extends Cell {
  constructor() {
    super('💣');
  }
}

export class Num extends Cell {
  constructor(value) {
    super(value);
    this.value = value;
  }
}

function revealCells(grid, x, y) {
  if (x >= 0 && y >= 0 && x < GRID_SIZE && y < GRID_SIZE && !grid[x][y].isVisible) {
    let cell = grid[x][y];
    cell.isVisible = true;

    //Si cette case contient un 0, je vais afficher les cases adjacentes
    if (cell instanceof Num && cell.value === 0) {
      let xs = [x, x - 1, x + 1]; //Les coordonées X des cases adjacentes
      let ys = [y, y - 1, y + 1]; //Les coordonées Y des cases adjacentes

      //Avec 2 for on combine nos deux tableaux
      for (let i of xs) {
        for (let j of ys) {
          //On appel la fonction click sur toutes nos cases adjacentes
          revealCells(grid, i, j);

          //Note : ici on appel aussi click sur la case courante car ça simplifie l'algo
          //Ce n'est pas gênant cet appel ne passera pas la première condition du
          //!this.gridIsVisible[x][y]
        }
      }

      // for(let i = x-1;i <= x+1; ++i) {}
    }
  }
}

class Demineur {
  constructor() {
    this.isGameOver = 0;

    this.grid = [
      [0, 1, 1, 1, 0],
      [0, 2, -1, 2, 0],
      [0, 2, -1, 2, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0]
    ].map((row) =>
      row.map((nb) =>
        nb === -1 ? new Mine() : new Num(nb)));
  }

  //Methode display
  display() {
    //Pour chaque lignes
    this.grid.forEach((row) => {

      //On récupère les valeurs affichables de chaque cellules,
      //et on les join pour que ce soit plus joli
      //join(' ') ici transforme [1, 2, 3] en '1 2 3'
      var displayableRow = row
        .map((cell) => cell.toString())
        .join(' ');

      // let displayableRow = '';
      // row.forEach((cell) => displayableRow += cell.toString() + ' ')

      console.log(displayableRow);
    });

    //empty row
    console.log();
  };

  //Methode flag
  flag(x, y) {
    let cell = this.grid[x][y];

    if (cell.isVisible) {
      console.log('Action impossible, cellule déjà révélée');
    } else {
      cell.isFlaged = !cell.isFlaged;
    }
  }

  //Methode click
  clicks(x, y) {
    //Si la partie n'est pas finie
    //Si les coordonées sont valides (dans la grille)
    //et si la case n'est pas déjà visible (cette condition évite la récusion infinie)
    if (x >= 0 && y >= 0 && x < GRID_SIZE && y < GRID_SIZE && !this.grid[x][y].isVisible) {
      if (this.grid[x][y].isFlaged) {
        return console.log('Action impossible, cette cellule a un flag');
      }

      revealCells(this.grid, x, y);

      //On regarde si on a gagnés
      if (this.grid[x][y] instanceof Mine) { // Si c'est une mine
        this.isGameOver = 1;

        console.log('You Lose !');
      } else { //Si ce n'est pas une mine

        //on regarde si toutes les cases non mines ont été révélées
        var nbVisibleCells = this.grid.reduce((res, row) => {
          return row.reduce((res2, cell) => res2 + (cell.isVisible ? 1 : 0), res);
        }, 0);

        // let res = 0;
        // for (let row of this.grid) {
        //   for (let cell of row) {
        //     if (cell.isVisible) {
        //       res += 1;
        //     }
        //   }
        // }

        //Si le nombre de cases visibles est égale au nombre de cases de la grille moins le nombre de mines
        if (nbVisibleCells === GRID_SIZE * GRID_SIZE - NUMBER_FO_MINES) {
          this.isGameOver = 2;

          console.log('You Win !');
        }
      }
    }
  }
}

//On expose la classe Demineur à require
export default Demineur;

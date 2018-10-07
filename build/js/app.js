new Vue({
  el: "#app",
  name: "app",
  data() {
    return {
      matrix: [],
      horizontal: 10,
      vertical: 10,
      probability: 0.1,
      errorInput: {
        horizontal: "",
        vertical: "",
        probability: ""
      },
      countDomens: 0, // походу не использовал это значение
      arrayBackgroundColor: [],
      groupsDomens: [],
      calculationTable: [],
      calculationNumber: 0,
      isClickCalculate: false,
      isDescription: false
    };
  },
  methods: {
    validateInputProps(value, tag) {
      switch (tag) {
        case "h": {
          if (typeof value === "number") {
            if (value < 2 || value > 40) {
              this.horizontal = "";
              this.errorInput.horizontal = true;
            } else {
              this.errorInput.horizontal = false;
            }
          } else {
            this.horizontal = "";
            this.errorInput.horizontal = true;
          }
          break;
        }
        case "v": {
          if (typeof value === "number") {
            if (value < 2 || value > 40) {
              this.vertical = "";
              this.errorInput.vertical = true;
            } else {
              this.errorInput.vertical = false;
            }
          } else {
            this.vertical = "";
            this.errorInput.vertical = true;
          }
          break;
        }
        case "p": {
          if (typeof value === "number") {
            if (value < 0.01 || value > 0.99) {
              this.probability = "";
              this.errorInput.probability = true;
            } else {
              this.errorInput.probability = false;
            }
          } else {
            this.probability = "";
            this.errorInput.probability = true;
          }
          break;
        }
      }
    },
    renderMatrix() {
      this.arrayBackgroundColor = [];
      let matrix = [];

      for (let i = 0; i < this.vertical; i++) {
        matrix[i] = [];
        for (let j = 0; j < this.horizontal; j++) {
          matrix[i][j] = 0;
        }
      }

      this.matrix = matrix;
    },
    renderMatrixAuto() {
      this.arrayBackgroundColor = [];
      let cellsCount = this.vertical * this.horizontal;

      let count = 0;

      var a = [];
      for (var i = 0; i < cellsCount; i++)
        a.push(i < cellsCount * this.probability ? 1 : 0);

      let matrix = [];

      var last = cellsCount;

      for (let i = 0; i < this.vertical; i++) {
        matrix[i] = [];
        for (let j = 0; j < this.horizontal; j++) {
          let rr = Math.floor(Math.random() * last);

          matrix[i].push(a[rr]);

          if (a[rr]) count++;

          a[rr] = a[--last];
        }
      }

      this.matrix = matrix;
      this.calculateDomens();
    },
    updateCell(value, v, h) {
      value = Number(!value);
      this.$set(this.matrix[v], h, value);

      let count = 0;
      let matrix = this.matrix;

      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j]) {
            ++count;
          }
        }
      }

      if (value) {
        count++;
      } else {
        count--;
      }

      this.probability =
        Math.floor((count * 100) / (this.horizontal * this.vertical)) / 100;

      if (this.isClickCalculate) {
        this.calculateDomens();
      }
    },
    // Расчет доменов--------------------------------------------
    calculateDomens() {
      let matrix = this.matrix;

      let groupsDomens = []; // массив групп с доменами

      let countGroup = 0;
      let closeCell = [];

      let str = "";

      for (let i = 0; i < matrix.length; i++) {
        str += "\n";

        for (let j = 0; j < matrix[i].length; ) {
          //переход на следующий ячейку только по определенным

          if (closeCell.length === 0) {
            closeCell.push({});
          } else {
            str += matrix[i][j] + " ";

            let checkCell = closeCell.filter(
              item => item.v === i && item.h === j
            );

            if (!matrix[i][j]) {
              closeCell.push({ v: i, h: j });
            }

            if (!checkCell.length) {
              if (matrix[i][j]) {
                // Если в ячейке 1, тогда создаем домен и заполняем его ячейками
                var domen = {};
                domen.id = ++countGroup;

                if (!domen.cells) {
                  // инициализируем массив для координат "1"
                  domen.cells = [];
                }

                // добавляем координату в массив ячеек

                domen.cells.push({ v: i, h: j });

                analyzeСells(matrix, i, j, domen, closeCell);

                groupsDomens.push(domen);
              }
            }

            j++;
          }
        }
      }
      this.countDomens = groupsDomens.length;

      this.arrayBackgroundColor = paintCells(groupsDomens);
      this.groupsDomens = groupsDomens;

      // Проверяем таблицу рассчетов
      // если расчетов больше 10
      if (this.calculationTable.length <= 10) {
        // Добавляем рассчет в таблицу
        this.calculationTable.push({
          id: ++this.calculationNumber,
          probability: this.probability,
          domens: this.countDomens,
          cells: this.horizontal * this.vertical
        });
      } else {
        this.calculationTable.shift();
        this.calculationTable.push({
          id: ++this.calculationNumber,
          probability: this.probability,
          domens: this.countDomens,
          cells: this.horizontal * this.vertical
        });
      }
    },
    backgroundCell(v, h) {
      let arr = this.arrayBackgroundColor;

      // return "gray";

      let color;

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].v == v && arr[i].h == h) {
          color = arr[i].backgroundColor;
          return color;
        } else {
          color = "#ffffff";
        }
      }
    }
  }
});

/* Блок вспомогательных функций */

/* ФУНКЦИЯ АНАЛИЗА СОСЕДЕЙ */

function analyzeСells(matrix, i, j, domen, closeCell) {
  let v = i;
  let h = j;

  // Ячейку, которую собираемся анализировать на соседства сразу добавляем в группу домена
  closeCell.push({ v: i, h: j });

  // СОСЕД СПРАВА

  // Если в соседней ячейке есть "1"

  // Здесь нужно проверить, чтобы ячейка для проверки была в диапазоне матрицы;
  if (h < matrix[i].length) {
    // Теперь проверяем, что соседняя ячейка содержит 1;

    if (matrix[v][h + 1]) {
      // если "Да", то для начала нужно проверить на совпадения с ячейками в домене
      if (!domen.cells.filter(item => item.v == v && item.h == h + 1).length) {
        // если "Да", то добавляем эту ячейку в домен
        domen.cells.push({ v: v, h: h + 1 });
      }

      // прежде чем запускать рекурсивную функцию, нужно проверить соседнюю ячейку на совпадение с ячейками из массива с уже проверенными ячейками

      if (!closeCell.filter(item => item.v === v && item.h === h + 1).length) {
        // и запускаем рекурсивную функцию для соседней ячейки
        analyzeСells(matrix, v, h + 1, domen, closeCell);
      }
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------

  // СОСЕД СНИЗУ

  // Если в соседней ячейке есть "1"

  // Здесь нужно проверить, чтобы ячейка для проверки была в диапазоне матрицы;
  if (v + 1 < matrix.length && h != null) {
    // Теперь проверяем, что соседняя ячейка содержит 1;

    if (matrix[v + 1][h]) {
      // если "Да", то для начала нужно проверить на совпадения с ячейками в домене
      if (!domen.cells.filter(item => item.v == v + 1 && item.h == h).length) {
        // если "Да", то добавляем эту ячейку в домен
        domen.cells.push({ v: v + 1, h: h });
      }

      // прежде чем запускать рекурсивную функцию, нужно проверить соседнюю ячейку на совпадение с ячейками из массива с уже проверенными ячейками

      if (!closeCell.filter(item => item.v === v + 1 && item.h === h).length) {
        // и запускаем рекурсивную функцию для соседней ячейки
        analyzeСells(matrix, v + 1, h, domen, closeCell);
      }
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------

  // СОСЕД СЛЕВА

  // Если в соседней ячейке есть "1"

  // Здесь нужно проверить, чтобы ячейка для проверки была в диапазоне матрицы;
  if (h >= 0) {
    // Теперь проверяем, что соседняя ячейка содержит 1;

    if (matrix[v][h - 1]) {
      // если "Да", то для начала нужно проверить на совпадения с ячейками в домене
      if (!domen.cells.filter(item => item.v == v && item.h == h - 1).length) {
        // если "Да", то добавляем эту ячейку в домен
        domen.cells.push({ v: v, h: h - 1 });
      }

      // прежде чем запускать рекурсивную функцию, нужно проверить соседнюю ячейку на совпадение с ячейками из массива с уже проверенными ячейками

      if (!closeCell.filter(item => item.v === v && item.h === h - 1).length) {
        // и запускаем рекурсивную функцию для соседней ячейки
        analyzeСells(matrix, v, h - 1, domen, closeCell);
      }
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------

  // СОСЕД СВЕРХУ

  // Если в соседней ячейке есть "1"

  // Здесь нужно проверить, чтобы ячейка для проверки была в диапазоне матрицы;
  if (v - 1 >= 0 && h != null) {
    // Теперь проверяем, что соседняя ячейка содержит 1;

    if (matrix[v - 1][h]) {
      // если "Да", то для начала нужно проверить на совпадения с ячейками в домене
      if (!domen.cells.filter(item => item.v == v - 1 && item.h == h).length) {
        // если "Да", то добавляем эту ячейку в домен
        domen.cells.push({ v: v - 1, h: h });
      }

      // прежде чем запускать рекурсивную функцию, нужно проверить соседнюю ячейку на совпадение с ячейками из массива с уже проверенными ячейками

      if (!closeCell.filter(item => item.v === v - 1 && item.h === h).length) {
        // и запускаем рекурсивную функцию для соседней ячейки
        analyzeСells(matrix, v - 1, h, domen, closeCell);
      }
    }
  }
}

/* ФУНКЦИЯ ФОРМИРОВАНИЯ ЦВЕТОВ ДЛЯ ДОМЕНОВ*/
function paintCells(arr) {

  // Создаем переменную для хранения цвета фона
  let backgroundColor;

  let arrayPrintCells = [];

  // Обходим массив
  arr.map(item => {
    // Чтобы вдруг ячейки не закрасились белым цветом, возьмем цвета только до #999999 - серый
    backgroundColor = "#" + Math.floor(Math.random() * 10066329).toString(16);

    item.cells.map(cell => {
      cell.backgroundColor = backgroundColor;
      arrayPrintCells.push(cell);
    });
  });

  return arrayPrintCells;
}

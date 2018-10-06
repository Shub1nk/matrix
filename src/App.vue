<template>
  <div id="app">
    <h1 class="title">Расчет количества доменов</h1>
    <div class="property">
      <div class="property__field">
        V: <input type="number" :class="{error: errorInput.vertical}" v-model.number="vertical" @blur="validateInputProps(vertical, 'v')">
        H: <input type="number" :class="{error: errorInput.horizontal}" v-model.number="horizontal" @blur="validateInputProps(horizontal, 'h')">
        %: <input type="number" step="0.1" :class="{error: errorInput.probability}" v-model.number="probability" @blur="validateInputProps(probability, 'p')">
        <p>Размерность матрицы 
          <span v-if="(horizontal*vertical) == 0"> не указана</span>
          <b v-else>{{vertical}} x {{horizontal}} = {{horizontal*vertical}} ячеек. Вероятность {{(probability*100).toFixed(0)}}%</b>
        </p>
      </div>
      <button @click="renderMatrix()" :disabled="(horizontal*vertical) == 0">Отобразить матрицу</button>
      <button @click="renderMatrixAuto()" :disabled="probability === ''">Автозаполнение</button>
    </div>
    <div class="matrix">
      <div class="matrix__row" v-for="(row, i) in matrix">
        <span class="matrix__cell" v-for="(cell, j) in row"  
        @click="updateCell(cell, i, j)"
        :class="{domens: cell == 1}">
          {{cell}}
        </span>
        <!-- :style="{backgroundColor: (cell === 1) ? 'green' : '', color: (cell === 1) ? 'white' : ''}" -->
      </div>      
    </div>
    <div class="domen">
      <button class="domen__calc" @click="calculateDomens">Посчитать домены</button>
      <p class="domen__result">В вашей матрице <b class="domen__result__num">{{countDomens}}</b> доменов</p>
      <table class="domen__table">
        <tr>
          <th>№ п/п</th>
          <th>Вероятность</th>
          <th>Количество доменов в матрице</th>
          <th>Количество ячеек в матрице</th>
        </tr>
        <tr>
          <td>1.</td>
          <td>0,5</td>
          <td>5</td>
          <td>100</td>
        </tr>
        <tr>
          <td>2.</td>
          <td>0,75</td>
          <td>15</td>
          <td>200</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      matrix: [
        [0, 1, 1, 0, 1, 1, 1],
        [1, 0, 1, 0, 0, 1, 1],
        [1, 1, 1, 1, 0, 0, 1],
        [0, 1, 0, 1, 0, 0 ,1],
        [0, 1, 1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1],
        // [0, 0, 0, 0, 1]
      ],
      horizontal: 10,
      vertical: 10,
      probability: 0.1,
      errorInput: {
        horizontal: "",
        vertical: "",
        probability: ""
      },
      countDomens: 0
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
      let cellsCount = this.vertical * this.horizontal;
      // console.log("Количество ячеек", cellsCount);

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

          // matrix[i][j] = Math.random() <= this.probability ? 1 : 0;
        }
      }
      // console.log('----------------------------------------------------')
      // console.log(count, matrix);

      this.matrix = matrix;
    },
    updateCell(value, i, j) {
      value = Number(!value);
      this.$set(this.matrix[i], j, value);
    },
    // Расчет доменов--------------------------------------------
    calculateDomens() {
      console.log(`
      ----------------------------
          Новый расчет доменов
      ----------------------------`);

      let matrix = this.matrix;
      console.log(matrix);

      let groupsDomens = []; // массив групп с доменами

      let countGroup = 0;
      let closeCell = [];

      let str = "  -  ";
      for (let i = 0; i < matrix.length; i++) {
        str += "\n";

        for (let j = 0; j < matrix[i].length; ) {
          //переход на следующий ячейку только по определенным

          // console.log('ДЛИННА ПРОВЕРЕННОГО МАССИВА', closeCell.length)

          if (closeCell.length === 0) {
            closeCell.push({});
          } else {
            str += matrix[i][j] + " ";

            let checkCell = closeCell.filter(
              item => item.v === i && item.h === j
            );

            // console.log('Первое совпадение',checkCell);

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

                console.log("Сформировали домен", domen);

                groupsDomens.push(domen);
              }
            }

            j++;
          }
        }
      }
      console.log(str);

      console.log("-----Группировка по доменам-----");
      console.log(groupsDomens);
      console.log("-----Массив проверенных ячеек-----");
      console.log(closeCell);
    }
    //-----------------------------------------------------------
  }
};

/* Блок вспомогательных функций */

/* Функция анализа соседей */

function analyzeСells(matrix, i, j, domen, closeCell) {
  let v = i;
  let h = j;

  console.log("Мои координаты", v, h, "Я содержу", matrix[v][h]);

  closeCell.push({ v: i, h: j });

  // СОСЕД СПРАВА

  // Если в соседней ячейке есть "1"
  console.log(
    "Сосед справа с координатами",
    v,
    h + 1,
    "содержит",
    matrix[v][h + 1]
  );
  // Здесь нужно проверить, чтобы ячейка для проверки была в диапазоне матрицы;
  if (h < matrix[i].length) {
    console.log(h, "<", matrix[i].length);
    console.log("ячейка справа содержит", matrix[v][h + 1]);
    console.log(matrix[v][h + 1] == true);

    // Теперь проверяем, что соседняя ячейка содержит 1;

    if (matrix[v][h + 1]) {
      // если "Да", то для начала нужно проверить на совпадения с ячейками в домене
      if (!domen.cells.filter(item => item.v == v && item.h == h + 1).length) {
        // если "Да", то добавляем эту ячейку в домен
        domen.cells.push({ v: v, h: h + 1 });
      }

      console.log("ЕБАТЬ, ПОПАЛ НА 1", matrix[v][h + 1]);

      // прежде чем запускать рекурсивную функцию, нужно проверить соседнюю ячейку на совпадение с ячейками из массива с уже проверенными ячейками
      console.log(
        "Совпадений",
        closeCell.filter(item => item.v === v && item.h === h + 1).length + 1
      );

      if (!closeCell.filter(item => item.v === v && item.h === h + 1).length) {
        console.log("УПС");
        // и запускаем рекурсивную функцию для соседней ячейки
        analyzeСells(matrix, v, h + 1, domen, closeCell);
      } else {
        console.log("!!!!!!!!!ALARM!!!!!!!!!");
      }
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------

  // СОСЕД СНИЗУ

  // Если в соседней ячейке есть "1"
  console.log(
    "Сосед снизу с координатами",
    v + 1,
    h,
    "содержит"
    // matrix[v + 1][h]
  );
  // Здесь нужно проверить, чтобы ячейка для проверки была в диапазоне матрицы;
  if (v + 1 < matrix.length && h != null) {
    console.log(v + 1, "<", matrix.length);
    console.log("ячейка снизу содержит", matrix[v][h + 1]);
    console.log(matrix[v + 1][h] == true);

    // Теперь проверяем, что соседняя ячейка содержит 1;

    if (matrix[v + 1][h]) {
      // если "Да", то для начала нужно проверить на совпадения с ячейками в домене
      if (!domen.cells.filter(item => item.v == v + 1 && item.h == h).length) {
        // если "Да", то добавляем эту ячейку в домен
        domen.cells.push({ v: v + 1, h: h });
      }

      console.log("ЕБАТЬ, ПОПАЛ НА 1", matrix[v + 1][h]);

      // прежде чем запускать рекурсивную функцию, нужно проверить соседнюю ячейку на совпадение с ячейками из массива с уже проверенными ячейками
      console.log(
        "Совпадений",
        closeCell.filter(item => item.v === v + 1 && item.h === h).length + 1
      );

      if (!closeCell.filter(item => item.v === v + 1 && item.h === h).length) {
        console.log("УПС");
        // и запускаем рекурсивную функцию для соседней ячейки
        analyzeСells(matrix, v + 1, h, domen, closeCell);
      } else {
        console.log("!!!!!!!!!ALARM!!!!!!!!!");
      }
    }
  }

  // СОСЕД СЛЕВА

  // Если в соседней ячейке есть "1"
  console.log(
    "Сосед СЛЕВА с координатами",
    v,
    h + 1,
    "содержит",
    matrix[v][h - 1]
  );
  // Здесь нужно проверить, чтобы ячейка для проверки была в диапазоне матрицы;
  if (h >= 0) {
    console.log(h, ">=", 0);
    console.log("ячейка СЛЕВА содержит", matrix[v][h - 1]);
    console.log(matrix[v][h - 1] == true);

    // Теперь проверяем, что соседняя ячейка содержит 1;

    if (matrix[v][h - 1]) {
      // если "Да", то для начала нужно проверить на совпадения с ячейками в домене
      if (!domen.cells.filter(item => item.v == v && item.h == h - 1).length) {
        // если "Да", то добавляем эту ячейку в домен
        domen.cells.push({ v: v, h: h - 1 });
      }

      console.log("ЕБАТЬ, ПОПАЛ НА 1", matrix[v][h - 1]);

      // прежде чем запускать рекурсивную функцию, нужно проверить соседнюю ячейку на совпадение с ячейками из массива с уже проверенными ячейками
      console.log(
        "Совпадений",
        closeCell.filter(item => item.v === v && item.h === h - 1).length + 1
      );

      if (!closeCell.filter(item => item.v === v && item.h === h - 1).length) {
        console.log("УПС");
        // и запускаем рекурсивную функцию для соседней ячейки
        analyzeСells(matrix, v, h - 1, domen, closeCell);
      } else {
        console.log("!!!!!!!!!ALARM!!!!!!!!!");
      }
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------------------

  // СОСЕД СВЕРХУ

  // Если в соседней ячейке есть "1"
  console.log(
    "Сосед снизу с координатами",
    v - 1,
    h,
    "содержит"
    // matrix[v + 1][h]
  );
  // Здесь нужно проверить, чтобы ячейка для проверки была в диапазоне матрицы;
  if (v - 1 >= 0 && h != null) {
    console.log(v - 1, ">=", 0);
    console.log("ячейка СВЕРХУ содержит", matrix[v-1][h]);
    console.log(matrix[v-1][h] == true);

    // Теперь проверяем, что соседняя ячейка содержит 1;

    if (matrix[v - 1][h]) {
      // если "Да", то для начала нужно проверить на совпадения с ячейками в домене
      if (!domen.cells.filter(item => item.v == v - 1 && item.h == h).length) {
        // если "Да", то добавляем эту ячейку в домен
        domen.cells.push({ v: v - 1, h: h });
      }

      console.log("ЕБАТЬ, ПОПАЛ НА 1", matrix[v - 1][h]);

      // прежде чем запускать рекурсивную функцию, нужно проверить соседнюю ячейку на совпадение с ячейками из массива с уже проверенными ячейками
      console.log(
        "Совпадений",
        closeCell.filter(item => item.v === v - 1 && item.h === h).length + 1
      );

      if (!closeCell.filter(item => item.v === v - 1 && item.h === h).length) {
        console.log("УПС");
        // и запускаем рекурсивную функцию для соседней ячейки
        analyzeСells(matrix, v - 1, h, domen, closeCell);
      } else {
        console.log("!!!!!!!!!ALARM!!!!!!!!!");
      }
    }
  }

  // Проверка соседа справа

  // if (matrix[v][h + 1]) {
  //   domen.cells.push({ v: v, h: h + 1 });

  //   // console.log("Проверяем соседа справа", v, h + 1);

  //   if (closeCell.filter(item => (item.v === v && item.h === h + 1).length)) {
  //     closeCell.push({ v: i, h: j + 1 });
  //     // console.log("ЧТО ТАМ В ПОСЛЕДНЕЙ ЯЧЕЙКЕ",closeCell[closeCell.length-1]);
  //     // console.log("Мои кординаты", v, h + 1, "я содержу", matrix[v][h + 1]);
  //     // console.log("--------------------------------------");
  //     analyzeСells(matrix, v, h + 1, domen, closeCell);
  //   } else {
  //     console.log("А соседа уже и не нужно проверять");
  //   }
  // }

  // Проверка соседа снизу

  // console.log("Проверяем соседа снизу", v + 1, h);
  // console.log("До проверки нижнего значения", v + 1, h, matrix[v + 1][h]);

  // if (v + 1 < matrix.length && h != null) {
  //   // console.log(v+1, "МЕНЬШЕ", matrix.length);

  //   if (matrix[v + 1][h]) {
  //     domen.cells.push({ v: v + 1, h: h });

  //     // console.log("ЧТО МЫ ЗДЕСЬ ИМЕЕМ ВООБЩЕ",matrix[v+1][h]);
  //     // console.log("Проверяем соседа снизу", v + 1, h);

  //     if (closeCell.filter(item => (item.v === v + 1 && item.h === h).length)) {
  //       // console.log("Мои кординаты", v + 1, h, "я содержу", matrix[v + 1][h]);
  //       // console.log("--------------------------------------");
  //       analyzeСells(matrix, v + 1, h, domen, closeCell);
  //     } else {
  //       console.log("А соседа уже и не нужно проверять");
  //     }
  //   }
  // }

  // Проверка соседа слева

  // console.log("ТЕКУЩАЯ КООРДИНАТА", v, h);
  // console.log("ПРОВЕРЯЕМ СОСЕДА СЛЕВА", v, h - 1);

  // // if ((v + 1 < matrix.length) && h != null)  {

  // // console.log(v+1, "МЕНЬШЕ", matrix.length);

  // if (matrix[v][h - 1]) {
  //   domen.cells.push({ v: v, h: h - 1 });

  //   console.log("ЧТО МЫ ЗДЕСЬ ИМЕЕМ ВООБЩЕ", v, h - 1, ":", matrix[v][h - 1]);
  //   console.log("Проверяем соседа слева", v, h - 1);

  //   for (
  //     h - 1;
  //     closeCell.filter(item => item.v === v && item.h === h - 1).length < 0;
  //     --h
  //   );
  //   {
  //     if (closeCell.filter(item => item.v === v && item.h === h - 1).length) {
  //       console.log(
  //         "Мои кординаты",
  //         v,
  //         h - 1,
  //         "я содержу",
  //         matrix[v][h - 1],
  //         "!!!!!!!!!!!!!!!!!!!!!!!!Блядь, да проверяли уже эту ячейку",
  //         "совпадений найдено:",
  //         closeCell.filter(item => item.v === v && item.h === h).length
  //       );
  //       console.log("--------------------------------------");

  //       console.log(h - 1);
  //       console.log(h);
  //       console.log(--h);
  //       console.log(h);
  //       console.log(
  //         "а теперь совпадений",
  //         closeCell.filter(item => item.v === v && item.h === h - 1).length
  //       );

  //       analyzeСells(matrix, v, h-1, domen, closeCell);

  //     }
  //   }

  //   // if (!(closeCell.filter(item => (item.v === v && item.h === h))).length) {
  //   //   // console.log('!!!!!!!!!!!!!!!!!!!!!!!!Блядь, да проверяли уже эту ячейку', 'совпадений найдено:', (closeCell.filter(item => (item.v === v && item.h === h)).length))
  //   //   // analyzeСells(matrix, v, h - 1, domen, closeCell);
  //   // } else {
  //   //   console.log('А вот хуй тебе получи по рылу')
  //   // }
  // } else {
  //   console.log("А соседа уже и не нужно проверять");
  // }
}

/* -----------------------------*/
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

body {
  margin: 0 auto;
  /* width: 1000px; */
}

.title {
}

.property {
  margin-bottom: 20px;
}

.property__field {
  margin-bottom: 20px;
}

.property input {
  padding: 5px 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.property button {
  padding: 10px;
  border: none;
  outline: none;
  color: #fff;
  background: green;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background: gray;
  cursor: default;
}

.matrix {
  margin-bottom: 20px;
}

.matrix__row {
}

.matrix__cell {
  display: inline-block;
  padding: 5px 10px;
  border: 1px dashed #000;
  cursor: pointer;
}

.matrix__cell:hover {
  background: #000;
  color: #fff;
}

.domen {
  margin-bottom: 10px;
}

.domen__calc {
  padding: 10px;
  border: none;
  outline: none;
  color: #fff;
  background: rgb(57, 57, 255);
  border-radius: 5px;
  cursor: pointer;
}

.domen__result__num {
  color: green;
}

.domen__table {
  margin: 0 auto;
  border-collapse: collapse;
}

.domen__table th,
.domen__table td {
  padding: 5px 10px;
  border: 1px solid gray;
}

input.error {
  border: 1px solid red;
  box-shadow: 0 0 5px red;
}

.domens {
  background: green;
  color: white;
}
</style>

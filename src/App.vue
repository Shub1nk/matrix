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
        :style="{backgroundColor: (cell === 1) ? 'green' : '', color: (cell === 1) ? 'white' : ''}">
          {{cell}}
        </span>
      </div>      
    </div>
    <div class="domen">
      <button class="domen__calc">Посчитать домены</button>
      <p class="domen__result">В вашей матрице <b class="domen__result__num">100</b> доменов</p>
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
      matrix: [],
      horizontal: 10,
      vertical: 10,
      probability: 0.1,
      errorInput: {
        horizontal: "",
        vertical: "",
        probability: ""
      }
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
      console.log("Количество ячеек", cellsCount);

      let count = 0;

      var a = [];
      for (var i = 0; i < cellsCount; i++) a.push(i < cellsCount * this.probability ? 1 : 0);

      let matrix = [];

      var last = cellsCount;

      for (let i = 0; i < this.vertical; i++) {
        matrix[i] = [];
        for (let j = 0; j < this.horizontal; j++) {

          let rr = Math.floor(Math.random() * last);

          matrix[i].push(a[rr]);

          if(a[rr])  count++;

          a[rr] = a[--last];

          // matrix[i][j] = Math.random() <= this.probability ? 1 : 0;
        }
      }
      console.log('----------------------------------------------------')
      console.log(count, matrix);

      this.matrix = matrix;
    },
    updateCell(value, i, j) {
      value = Number(!value);
      this.$set(this.matrix[i], j, value);
    }
  }
};
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

.title {}

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

.matrix__row {}

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
</style>

<template>
  <div id="app">
    <h1 class="title">Расчет количества доменов</h1>
    <div class="property">
      <div class="property__field">
        <input type="text" value="Количество ячеек по горизонтали">
        <input type="text" value="Количество ячеек по вертикали">
        <input type="text" value="Вероятность от 0.01 до 0.99">
      </div>
      <button>Отобразить матрицу</button>
      <button>Автозаполнение</button>
    </div>
    <div class="matrica">
      <div class="matrica__row" v-for="(row, i) in matrica" :key="row[i]">
        <span class="matrica__cell" v-for="(cell, j) in row" :key="cell[j]">{{cell}}</span>
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
      matrica: [
        [1, 0, 0, 0, 0], 
        [1, 0, 0, 1, 0], 
        [1, 0, 1, 0, 0], 
        [1, 1, 0, 0, 0], 
        [1, 1, 0, 1, 0]
        ]
    };
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
  width: 1000px;
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

.matrica {
  margin-bottom: 20px;
}

.matrica__row {
}

.matrica__cell {
  display: inline-block;
  padding: 15px 20px;
  border: 1px dashed #000;
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

.domen__table th, .domen__table td {
  padding: 5px 10px;
  border: 1px solid gray;  
}
</style>

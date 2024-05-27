<template>
    <h2 class="summaryh"> Summary: </h2>
        <div class="container">
            <div class="totals">
                <div class="total">
                    <h2>Total Expenses:</h2>
                        <p>{{ totalExpenses }}</p>
                </div>

                <div class="total">
                    <h2>Total Income:</h2>
                        <p>{{ totalIncome }}</p>
                </div>

                <div class="total">
                    <h2>Balance:</h2>
                        <p>{{ balance }}</p>
                </div>

            </div>
        </div>
</template>
  
  <script setup>
  import { collection, onSnapshot } from 'firebase/firestore';
  import { ref, computed, onMounted } from 'vue';
  import db from './firebase/config.js';
  
  const expenses = ref([]);
  const incomes = ref([]);
  
  const getExpensesAndIncomes = async () => {
    onSnapshot(collection(db, 'expenseIncomeTracker'), (querySnapshot) => {
      const tmpExpenses = [];
      const tmpIncomes = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().type === 'Expense') {
          tmpExpenses.push(doc.data().amount);
        } else if (doc.data().type === 'Income') {
          tmpIncomes.push(doc.data().amount);
        }
      });
      expenses.value = tmpExpenses;
      incomes.value = tmpIncomes;
    });
  };
  
  onMounted(() => {
    getExpensesAndIncomes();
  });
  
  const totalExpenses = computed(() => {
    return expenses.value.reduce((acc, expense) => acc + expense, 0);
  });
  
  const totalIncome = computed(() => {
    return incomes.value.reduce((acc, income) => acc + income, 0);
  });
  
  const balance = computed(() => {
    return totalIncome.value - totalExpenses.value;
  });
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    gap: 5px
  }
  
  .totals {
  margin-top: 0;
  gap: 20px;
}

.total {
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  background-color: blue;
  margin-top: 2%;
  width: 800px
}

.summaryh {
    color: black;
    letter-spacing: 1px;
    font-family: 'Cavilant';
    margin-left: 5%;
    font-size: 3rem;
    margin-top: 5%;
  }

  .total h2 {
    margin-bottom: 10px;
    color:#ffffff;
    text-shadow: 2px 2px black;
    letter-spacing: 1px;
    font-family: 'Cavilant';
  }
  
  .total p {
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
  }
  </style>
  
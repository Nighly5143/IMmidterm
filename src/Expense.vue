<template>
    <div class="container">
      <!-- Expense Form -->
      <div class="expense-form">
        <h2>Add Expense</h2>
        <form @submit.prevent="addExpense">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" class="form-control" v-model="newExpense.name" id="name">
          </div>
          <div class="form-group">
            <label for="amount">Amount:</label>
            <input type="number" class="form-control" v-model="newExpense.amount" id="amount">
          </div>
          <div class="form-group">
            <label for="category">Category:</label>
            <select class="form-control" v-model="newExpense.category" id="category">
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <button type="submit">Add Expense</button>
        </form>
      </div>
  
      <!-- Expense Table with adjusted width -->
      <div class="scrollable-table">
        <table class="expense-table">
          <thead>
            <tr>
              <th @click="sortByDate()">Date</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in sortedExpenses" :key="expense.id">
              <td>{{ formatDate(expense.data.datetime) }}</td>
              <td>{{ expense.data.name }}</td>
              <td>{{ expense.data.amount }}</td>
              <td>{{ expense.data.category }}</td>
              <td><button @click="onEdit(expense.id)">Edit</button></td>
              <td><button @click="onDelete(expense.id)">Delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Footer section -->
      <div class="footer">
        <table class="table">
          <tfoot>
            <tr>
              <td>Total Expense:</td>
              <td>{{ totalExpense }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { collection, addDoc, onSnapshot, doc, deleteDoc, setDoc } from 'firebase/firestore';
  import { ref, onMounted, computed } from 'vue';
  import db from './firebase/config.js';
  
  const newExpense = ref({
    name: '',
    amount: '',
    category: ''
  });
  const editId = ref(null); 
  
  const expenses = ref([]);
  
  const getExpenses = async () => {
    onSnapshot(collection(db, 'expenseIncomeTracker'), (querySnapshot) => {
      const tmpExpenses = [];
      querySnapshot.forEach((doc) => {
        tmpExpenses.push({
          id: doc.id,
          data: doc.data()
        });
      });
      expenses.value = tmpExpenses;
    });
  };
  
  onMounted(() => {
    getExpenses();
  });
  
  const sortedExpenses = computed(() => {
    return expenses.value.filter(expense => expense.data.type === 'Expense')
    .slice()
    .sort((a, b) => {
      return new Date(b.data.datetime.seconds * 1000) - new Date(a.data.datetime.seconds * 1000);
    });
  });
  
  const totalExpense = computed(() => {
    return expenses.value
      .filter(expense => expense.data.type === 'Expense')
      .reduce((total, expense) => total + expense.data.amount, 0);
  });
  
  const addExpense = async () => {
    if (!newExpense.value.name.trim() || !newExpense.value.amount.toString().trim() || !newExpense.value.category.trim()) {
      alert('Please fill in all fields.');
      return;
    }
  
    const expenseData = {
      datetime: new Date(),
      name: newExpense.value.name,
      amount: parseFloat(newExpense.value.amount),
      category: newExpense.value.category,
      type: 'Expense'
    };
  
    try {
      if (editId.value !== null) {
   
        await updateExpense(editId.value, expenseData);
      } else {
       
        await addDoc(collection(db, 'expenseIncomeTracker'), expenseData);
      }
  
      newExpense.value.name = '';
      newExpense.value.amount = '';
      newExpense.value.category = '';
   
      editId.value = null;
    } catch (error) {
      console.error('Error adding/editing expense:', error);
    }
  };
  
  
  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
      return 'Invalid Date';
    }
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    return date.toLocaleDateString();
  };
  
  const sortByDate = () => {
    expenses.value.sort((a, b) => {
      return new Date(b.data.datetime.seconds * 1000) - new Date(a.data.datetime.seconds * 1000);
    });
  };
  
  const onDelete = async (id) => {
      const confirmDelete = confirm("Are you sure you want to delete this?");
      if (confirmDelete) {
        await deleteDoc(doc(db, 'expenseIncomeTracker', id));
        expenses.value = expenses.value.filter((expense) => expense.id !== id);
      }
  };
    
  const onEdit = async (id) => {
      const expense = expenses.value.find((expense) => expense.id === id);
    
      if (expense) {
          newExpense.value.name = expense.data.name;
          newExpense.value.amount = expense.data.amount;
          newExpense.value.category = expense.data.category;
          editId.value = id;
      } else {
          console.error('Expense not found.');
      }
  };
  
  
  
  const updateExpense = async (id, data) => {
      await setDoc(doc(db, 'expenseIncomeTracker', id), data); 
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    border-radius: 5px;
    border: 1px solid black;
    background-color: blue;
  }
  
  .expense-form {
    width: 45%;
    border: 1px solid black;
    border-radius: 5px;
    padding: 10px;
    background-color: white;
  }
  
  .expense-form h2 {
    margin-bottom: 10px;
    color: black;
    font-family: 'Cavilant';
    font-weight: bold;
  }
  
  .expense-form form {
    display: block;
    flex-direction: column;
  }
  
  .expense-form .form-group {
    margin-bottom: 10px;
  }
  
  .expense-form label {
    margin-bottom: 5px;
    /* color: palevioletred; */
    color: black;
    
  }
  
  .expense-form input {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .expense-form label, input {
    display: block;
  }
  
  .expense-form button {
    padding: 8px 12px;
    background-color: blue;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button {
    padding: 8px 12px;
    background-color: blue;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .scrollable-table {
    width: 120%;
    overflow-y: auto;
    max-height: 500px;
    margin-left: 5%;
    border-radius: 5px;
    border: 1px solid black;
    padding: 10px;
    background-color: white;
  }
  
  .expense-table {
    width: 100%; 
    border-collapse: collapse;
    border-radius: 10px;
  }
  
  .expense-table th,
  .expense-table td {
    padding: 8px;
    border-bottom: 1px solid #ddd;
    text-align: left;
    color: black;
  }
  
  .expense-table th {
    background-color: #f2f2f2;
  }
  
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50%;
    margin-left: 40%;
    font-weight: bold;
  }
  
  .footer td {
    color: black;
    transform: translate(-40px, -150px);
  }
  </style>
  
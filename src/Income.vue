<template>
  <div class="container">
    <div class="income-form">
      <h2>Add Income</h2>
      <form @submit.prevent="addIncome">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" class="form-control" v-model="newIncome.name" id="name">
        </div>
        <div class="form-group">
          <label for="amount">Amount:</label>
          <input type="number" class="form-control" v-model="newIncome.amount" id="amount">
        </div>
        <!-- Uncomment if category is required
        <div class="form-group">
          <label for="category">Category:</label>
          <input type="text" class="form-control" v-model="newIncome.category" id="category">
        </div>
        -->
        <button type="submit">Add Income</button>
      </form>
    </div>
    <div class="scrollable-table">
      <table class="income-table">
        <thead>
          <tr>
            <th @click="sortByDate">Date</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="income in sortedIncomes" :key="income.id">
            <td>{{ formatDate(income.data.datetime) }}</td>
            <td>{{ income.data.name }}</td>
            <td>{{ income.data.amount }}</td>
            <td><button @click="onEdit(income.id)">Edit</button></td>
            <td><button @click="onDelete(income.id)">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="footer">
      <table class="table">
        <tfoot>
          <tr>
            <td>Total Income:</td>
            <td>{{ totalIncome }}</td>
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

const newIncome = ref({
  name: '',
  amount: '',
  // Uncomment if category is required
  // category: ''
});

const editId = ref(null);
const incomes = ref([]);

const getIncomes = async () => {
  onSnapshot(collection(db, 'expenseIncomeTracker'), (querySnapshot) => {
    const tmpIncomes = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().type === 'Income') {
        tmpIncomes.push({
          id: doc.id,
          data: doc.data()
        });
      }
    });
    incomes.value = tmpIncomes;
  });
};

onMounted(() => {
  getIncomes();
});

const sortedIncomes = computed(() => {
  return incomes.value.slice().sort((a, b) => {
    return new Date(b.data.datetime.seconds * 1000) - new Date(a.data.datetime.seconds * 1000);
  });
});

const totalIncome = computed(() => {
  return incomes.value.reduce((total, income) => total + income.data.amount, 0);
});

const addIncome = async () => {
  if (!newIncome.value.name.trim() || !newIncome.value.amount.toString().trim()) {
    alert('Please fill in all fields.');
    return;
  }

  const incomeData = {
    datetime: new Date(),
    name: newIncome.value.name,
    amount: parseFloat(newIncome.value.amount),
    // Uncomment if category is required
    // category: newIncome.value.category.trim(),
    type: 'Income'
  };

  try {
    if (editId.value !== null) {
      await updateIncome(editId.value, incomeData);
    } else {
      await addDoc(collection(db, 'expenseIncomeTracker'), incomeData);
    }

    newIncome.value = {
      name: '',
      amount: '',
      // Uncomment if category is required
      // category: ''
    };

    editId.value = null;
  } catch (error) {
    console.error('Error adding/editing income:', error);
  }
};

const formatDate = (timestamp) => {
  if (!timestamp || !timestamp.seconds) {
    return 'Invalid Date';
  }
  const milliseconds = timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000;
  const date = new Date(milliseconds);
  return date.toLocaleDateString();
};

const sortByDate = () => {
  incomes.value.sort((a, b) => {
    return new Date(b.data.datetime.seconds * 1000) - new Date(a.data.datetime.seconds * 1000);
  });
};

const onDelete = async (id) => {
  const confirmDelete = confirm("Are you sure you want to delete this?");
  if (confirmDelete) {
    await deleteDoc(doc(db, 'expenseIncomeTracker', id));
    incomes.value = incomes.value.filter((income) => income.id !== id);
  }
};

const onEdit = async (id) => {
  const income = incomes.value.find((income) => income.id === id);

  if (income) {
    newIncome.value = {
      name: income.data.name,
      amount: income.data.amount,
      // Uncomment if category is required
      // category: income.data.category
    };
    editId.value = id; 
  } else {
    console.error('Income not found.');
  }
};

const updateIncome = async (id, data) => {
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
  border: 1px solid black;
  background-color: blue;
}

.income-form {
  width: 45%;
  border: 1px solid black;
  border-radius: 5px;
  padding: 10px;
  background-color: white;
}

.income-form h2 {
  margin-bottom: 10px;
  color: black;
  font-family: 'Cavilant';
  font-weight: bold;
}

.income-form form {
  display: block;
  flex-direction: column;
}

.income-form .form-group {
  margin-bottom: 10px;
}

.income-form label {
  margin-bottom: 5px;
  color: black;
}

.income-form input {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.income-form label,
.income-form input {
  display: block;
}

.income-form button {
  padding: 8px 12px;
  background-color: blue;
  color: #fff;
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
  border: 1px solid black;
  padding: 10px;
  background-color: white;
}

.income-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 10px;
}

.income-table th,
.income-table td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  color: black;
}

.income-table th {
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

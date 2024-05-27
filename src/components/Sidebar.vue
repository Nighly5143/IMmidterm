<template>
    <div class="sidebar">
      <router-link to="/home">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/contact">Contact</router-link>
    </div>
  </template>
  
  <script>

  
  export default {
    name: 'Sidebar'
  }
  </script>
  
  <style>
  .sidebar {
    width: 200px;
    background-color: #c51010;
    padding: 1px;
    display: block;
  }
  
  .sidebar router-link {
    display: block;
    margin-bottom: 10px;
    text-decoration: none;
    color: #333;
  }
  
  .sidebar router-link.active {
    color: blue;
  }
  </style>
  
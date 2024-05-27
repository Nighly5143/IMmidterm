<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="container">
    <div class="side-bar"> 

      <div class="title">
      <H1>Expense-Income Tracker</H1>
      <p></p>        
      </div>


      <div class="navigation">
        <RouterLink to="/">Expenses</RouterLink>
        <RouterLink to="/income">Income</RouterLink>    
        <RouterLink to="/summary">Summary</RouterLink>  
      </div>

    </div>
    <div class="content">
      <RouterView />   
    </div>
  </div>


</template>

<style>

  body{
    margin-left: -250px;
  }
  .container{
    display: flex;
    width: 100rem;
    flex-direction: row;


  }

  .side-bar{
    background-position: 0px 290px;
    background-repeat: no-repeat;
    background-size: 500px;
    margin-left: 10;
    background-color: rgb(255, 255, 255);
    width: 20%;
    height: 43.99rem;
    z-index: 1;
    /* background: rgb(255, 176, 213); */
    background: blue;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-left: 0;
    padding-left: 0;
    flex: 0 0 20%;
    border: 1px solid black;

  }

  .title{
    margin: 3rem 2rem;
    margin-top: 2rem;
    color: rgb(34, 34, 34);
  }
  
  .title h1{
    text-align: right;
    font-size: 35px;
    font-weight: 1000;
    letter-spacing: -2px;
    font-family: 'Cavilant';
    margin: 0;
    color: white;

  }
  .side-bar p{
    text-align: right;
    font-family: 'Cavilant';
    margin: 0;
  }

  .wrapper h3{
    margin: 0;
  }

  .navigation {
    display: flex;
    flex-direction: column;
    text-align: right;
    margin: 0rem 2rem;
    font-size: 20px;
    font-family: 'Poppins';
  }

  .navigation a{
    text-decoration: none;
    letter-spacing: -.5px;
    margin: .5rem 0rem;
    color: white;
    padding: 5px 25px;
    margin: 10px auto;
    border-radius: 10px;
    margin-right: 0;
    transition: .5s ease;
  }
  .navigation a:hover{
    
    color: rgb(3, 2, 3);
    background-color:  rgb(255, 239, 239);
  }
  .navigation a.router-link-active{
    color: rgb(2, 1, 2);
    background-color:  rgb(255, 235, 235);
    padding: 5px 25px;
    margin: 10px auto;
    margin-right: 0;
    text-align: right;
    border-radius: 10px;
  }

  .content{
    width: 80%;
    margin-right: 0;
    flex: 1;
  }

  * {
  box-sizing: border-box;
  padding: 0;
  
}
  
</style>

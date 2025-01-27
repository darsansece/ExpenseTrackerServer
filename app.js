// // function print(){
// //     console.log("eda monehh...mernapp da")
// // }
// // print()

// const express = require('express');

// const app = express();
// const port = 3000;
// const data =[
//     {id:1, name:"a",address:"aa"},
//     {id:2, name:"b",address:"bb"},
//     {id:3, name:"c",address:"cc"}
// ];



// app.get('/api/data', (req,res)=>{      //  'api/data' is the path
//     res.json(data);
// });

// app.listen(port, ()=>{
//     console.log(`server is running on port 3000 http://localhost:${port}`);
// });

// app.get("/api/singledata",(req,res) => {
//     const {name,id} = req.query;

//     if (name,id){
//         const result = data.find((item) => item.name === String(name)&& item.id===Number(id));
//         if(result){
//             res.json(result);
//         }else{
//             res.status(400).json({error:"Data not found for the given ID"})
//         }
//     }else{
//         res.json(data);
//     }
// });

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;


const mongoUrl = "mongodb+srv://darsans2023csbs:1234@cluster0.3fjmyh9.mongodb.net/ExpenseTracker";
mongoose.connect(mongoUrl)
  .then(() => {
    console.log("DB connected successful");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true }
});
const Expense = mongoose.model("ExpenseTracker", expenseSchema);

app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/expenses/:title', async (req, res) => {
    const { title } = req.params;
  
    try {
      const result = await Expense.findOne({ title });
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: 'No data found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  const { v4: uuidv4 } = require('uuid');

  app.post("/api/expenses", async (req, res) => {
    let body = "";
  
    req.on("data", (chunk) => {
      body += chunk;
    });
  
    req.on("end", async () => {
      try {
        // Parse the incoming JSON body
        const { title, amount } = JSON.parse(body);
  
        // Create a new expense
        const newExpense = new Expense({
          id: uuidv4(),
          title,
          amount,
        });
  
        // Save the expense to the database
        const savedExpense = await newExpense.save();
  
        // Respond with the saved expense
        res.status(200).json(savedExpense);
      } catch (err) {
        // Handle errors gracefully
        res.status(500).json({ message: err.message });
      }
    });
  });


app.use(express. json());
app.put("/api/expenses/:id",async(req, res)=> {
  const{id}=req.params;
  const{title,amount}=req.body;
  
  try{
    const updateExpenses = await Expense.findOneAndUpdate(
      { id },
      { title, amount }
    );
    if(!updateExpenses){
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json();
  }catch (error){
    res.status(500).json({ message: "Error in updating expense" });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedExpense = await Expense.findOneAndDelete({ id });
    if (!deletedExpense) {
      res.status(404).json({ message: "No data found" });
    } else {
      res.status(200).json(deletedExpense);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
import { API, graphqlOperation } from "aws-amplify";
import React, { useState, useEffect } from "react";
import { listTodos } from "./graphql/queries";
import { deleteTodo, createTodo, updateTodo } from "./graphql/mutations";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoName, setEditedTodoName] = useState("");
  const [initialTodoName, setInitialTodoName] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  async function getTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todoList = todoData.data.listTodos.items;
      console.log("todoList: ", todoList);
      setTodos(todoList);
    } catch (e) {
      console.log("error fetching todos", e);
    }
  }

  async function handleDeleteTodo(id) {
    try {
      const todoData = await API.graphql(
        graphqlOperation(deleteTodo, { input: { id } })
      );
      const deletedTodoId = todoData.data.deleteTodo.id;
      console.log("deletedTodoId: ", deletedTodoId);
      setTodos((todos) => todos.filter((todo) => todo.id !== deletedTodoId));
    } catch (e) {
      console.log("error deleting todo", e);
    }
  }

  function handleCancelEdit() {
    setEditingTodoId(null);
    setEditedTodoName("");
    setInitialTodoName("");
  }

  async function handleCreateTodo() {
    try {
      const todoData = await API.graphql(
        graphqlOperation(createTodo, { input: { name: newTodoName } })
      );
      const newTodo = todoData.data.createTodo;
      console.log("newTodo: ", newTodo);
      setTodos((todos) => [...todos, newTodo]);
      setNewTodoName("");
    } catch (e) {
      console.log("error creating todo", e);
    }
  }

  async function handleUpdateTodo(event) {
    event.preventDefault();
    try {
      const todoData = await API.graphql(
        graphqlOperation(updateTodo, {
          input: { id: editingTodoId, name: editedTodoName },
        })
      );
      const updatedTodo = todoData.data.updateTodo;
      setTodos((todos) =>
        todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
      setEditingTodoId(null);
      setInitialTodoName("");
      setEditedTodoName("");
    } catch (e) {
      console.log("error updating todo", e);
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: "#E0FFFF",
        height: "100vh",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <AppBar sx={{ marginBottom: "10px" }} position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div">
            AA Testing Ground
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#F9F9F9",
            borderRadius: "20px",
            padding: "20px",
            width: "60%",
            boxShadow: "10px 10px 20px 0px rgba(0,0,0,0.2)",
            flexGrow: 1,
            marginRight: "20px",
          }}
        >
          <AppBar
            sx={{ marginBottom: "10px" }}
            position="static"
            color="primary"
          >
            <Toolbar>
              <Typography variant="h6" component="div">
                Outstanding Items
              </Typography>
            </Toolbar>
          </AppBar>
          {todos.map((todo) => (
            <Paper
              key={todo.id}
              sx={{
                padding: "10px",
                marginBottom: "10px",
                cursor: "pointer",
                borderRadius: "10px",
                position: "relative",
                "&:hover .edit-button, &:hover .ok-button, &:hover .cancel-button, &:hover .delete-button":
                  {
                    display: "block",
                  },
              }}
              onMouseEnter={(event) => {
                if (editingTodoId !== todo.id) {
                  event.target.style.backgroundColor = "#F0F8FF";
                }
              }}
              onMouseLeave={(event) => {
                event.target.style.backgroundColor = "#FFFFFF";
              }}
            >
              {editingTodoId === todo.id ? (
                <form onSubmit={handleUpdateTodo}>
                  <TextField
                    label="Edit Item"
                    value={editedTodoName}
                    onChange={(event) => setEditedTodoName(event.target.value)}
                    variant="outlined"
                    sx={{ marginRight: "10px" }}
                  />
                  <IconButton
                    type="submit"
                    aria-label="ok"
                    className="ok-button"
                    sx={{
                      position: "absolute",
                      top: "5px",
                      right: "60px",
                      display: "none",
                      bgcolor: "success.main",
                      "&:hover": {
                        bgcolor: "success.dark",
                      },
                      transition: "opacity 0.2s ease-in-out",
                      opacity: 0.6,
                    }}
                    onMouseEnter={(event) => {
                      event.target.style.opacity = 1;
                    }}
                    onMouseLeave={(event) => {
                      event.target.style.opacity = 0.6;
                    }}
                  >
                    <CheckIcon sx={{ bgcolor: "inherit" }} />
                  </IconButton>
                  <IconButton
                    type="button"
                    aria-label="cancel"
                    className="cancel-button"
                    sx={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      display: "none",
                      bgcolor: "error.main",
                      "&:hover": {
                        bgcolor: "error.dark",
                      },
                      transition: "opacity 0.2s ease-in-out",
                      opacity: 0.6,
                    }}
                    onClick={handleCancelEdit}
                    onMouseEnter={(event) => {
                      event.target.style.opacity = 1;
                    }}
                    onMouseLeave={(event) => {
                      event.target.style.opacity = 0.6;
                    }}
                  >
                    <CloseIcon sx={{ bgcolor: "inherit" }} />
                  </IconButton>
                </form>
              ) : (
                <>
                  <Typography
                    variant="h4"
                    sx={{ display: "inline-block", marginRight: "10px" }}
                  >
                    {todo.name}
                  </Typography>
                  <IconButton
                    aria-label="edit"
                    className="edit-button"
                    sx={{
                      position: "absolute",
                      top: "5px",
                      right: "60px",
                      display: "none",
                      bgcolor: "info.main",
                      "&:hover": {
                        bgcolor: "info.dark",
                      },
                      transition: "opacity 0.2s ease-in-out",
                      opacity: 0.6,
                    }}
                    onMouseEnter={(event) => {
                      event.target.style.opacity = 1;
                    }}
                    onMouseLeave={(event) => {
                      event.target.style.opacity = 0.6;
                    }}
                    onClick={() => {
                      setInitialTodoName(todo.name);
                      setEditedTodoName(todo.name);
                      setEditingTodoId(todo.id);
                    }}
                  >
                    <EditIcon sx={{ bgcolor: "inherit" }} />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    className="delete-button"
                    sx={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      display: "none",
                      bgcolor: "error.main",
                      "&:hover": {
                        bgcolor: "error.dark",
                      },
                      transition: "opacity 0.2s ease-in-out",
                      opacity: 0.6,
                    }}
                    onMouseEnter={(event) => {
                      event.target.style.opacity = 1;
                    }}
                    onMouseLeave={(event) => {
                      event.target.style.opacity = 0.6;
                    }}
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    <DeleteIcon sx={{ bgcolor: "inherit" }} />
                  </IconButton>
                </>
              )}
            </Paper>
          ))}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <TextField
              label="Create Task"
              value={newTodoName}
              onChange={(event) => setNewTodoName(event.target.value)}
              variant="outlined"
              sx={{ marginRight: "10px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateTodo}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default App;

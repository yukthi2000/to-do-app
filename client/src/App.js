import "./index.css";
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3005";

function App() {
  const [todos, setTodos] = useState([]);
  const [popactive, setPopipactive] = useState(false);
  const [newtodo, setNewtodo] = useState("");

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error : ", err));
  };

  const completeToDo = async (id) => {
    const data = await fetch(API_BASE + "/todo/complete/" + id).then((res) =>
      res.json()
    );

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      })
    );
  };

  const deleteToDo = async (id) => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };


  const addTodo =async ()=>{
		const data = await fetch (API_BASE + "/todo/new",{
			method:"POST",
			headers:{"content-Type":"application/json"},
			body:JSON.stringify({
				text:newtodo
			})
		}).then(res=>res.json());
		setTodos([...todos,data]);
		setPopipactive(false);
		setNewtodo("");
  }

  return (
    <div className="App">
      <h1>Welcome</h1>
      <h4>Yout Tasks</h4>
      <div className="todos">
        {todos.map((todo) => (
          <div
            className={"todo " + (todo.complete ? "is-complete" : "")}
            key={todo._id}
            onClick={() => {
              completeToDo(todo._id);
            }}
          >
            <div className="checkbox"></div>
            <div className="text">{todo.text} </div>

            <div className="delete-todo" onClick={() => deleteToDo(todo._id)}>
              x
            </div>
          </div>
        ))}
      </div>

	  <div className="addpopup" onClick={()=>{
		setPopipactive(true)
	  }}> + </div>

	  {popactive ? (<div className="popup">
		<div className="closepopup" onClick={()=>{
			setPopipactive(false)
		}}>x</div>
		<div className="content">
			<h3>Add Task</h3>
			<input type="text" className="add-todo-input"
			onChange={e=>setNewtodo(e.target.value)} 
			value={newtodo} />
			<div className="button" onClick={addTodo} >Create task</div>
		</div>
	  </div>) : ""}
    </div>
  );
}

export default App;

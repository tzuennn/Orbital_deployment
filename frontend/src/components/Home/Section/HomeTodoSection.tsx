import { filterTodos } from "@/components/Todo/TodoList";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import TodoItem from "@/components/Todo/TodoItem";
import HomeButton from "@/components/Home/HomeButton";

export default function HomeTodoSection({ style }: { style: string }) {
  const { todos, filter } = useSelector((state: RootState) => state.todo);

  return (
    <div className={`relative ${style}`}>
      <div className="mb-3 ml-2 font-bold text-xl border-b-2 border-white pb-1">
        Todos
      </div>
      <div className="mb-2">
        <ul className="space-y-4">
          {filterTodos(todos, filter)
            .slice(0, 3)
            .map((todo) => (
              <TodoItem key={todo.id} todo={todo} isHome={true} />
            ))}
        </ul>
      </div>
      <div className="absolute bottom-2 right-4">
        <HomeButton web={"/todos"} buttonText={"Proceed to check"} />
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { Trophy, Calendar, CheckCircle, PlusCircle, Star } from 'lucide-react';
import { useTodoStore } from './store/todoStore';
import { ranks } from './lib/ranks';

function App() {
  const { todos, profile, fetchTodos, fetchProfile, addTodo, completeTodo } = useTodoStore();
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchTodos();
    fetchProfile();
  }, []);

  const calculatePoints = (title: string) => {
    // Simple algorithm: length of title * 10
    return Math.max(title.length * 10, 50);
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    await addTodo({
      title: newTodo,
      points: calculatePoints(newTodo),
      due_date: new Date(dueDate).toISOString(),
      completed: false
    });

    setNewTodo('');
  };

  const currentRank = ranks.find(r => r.name === profile?.current_rank);
  const nextRank = ranks.find(r => r.minPoints > (profile?.total_points || 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">AI Task Master</h1>
          
          <div className="flex items-center space-x-4">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-sm opacity-80">Current Rank</p>
              <p className={`font-bold ${currentRank?.color}`}>{profile?.current_rank}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Total Points</p>
              <p className="font-bold text-yellow-400">{profile?.total_points || 0}</p>
            </div>
          </div>
        </div>

        {nextRank && (
          <div className="mb-8 bg-gray-800 rounded-lg p-4">
            <p className="text-sm opacity-80">Next Rank: {nextRank.name}</p>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className={`${nextRank.color} h-2 rounded-full transition-all`}
                style={{ 
                  width: `${Math.min(100, ((profile?.total_points || 0) / nextRank.minPoints) * 100)}%`
                }}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleAddTodo} className="mb-8 flex space-x-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 rounded-lg px-6 py-2 flex items-center space-x-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </form>

        <div className="space-y-4">
          {todos.map(todo => {
            const isOverdue = isBefore(new Date(todo.due_date), addDays(new Date(), -2));
            const isCurrent = isAfter(new Date(todo.due_date), new Date());

            return (
              <div
                key={todo.id}
                className={`bg-gray-800 rounded-lg p-4 flex items-center justify-between ${
                  todo.completed ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => !todo.completed && completeTodo(todo.id)}
                    className={`${
                      todo.completed
                        ? 'text-green-500'
                        : 'text-gray-400 hover:text-green-500'
                    }`}
                  >
                    <CheckCircle className="w-6 h-6" />
                  </button>
                  
                  <div>
                    <h3 className="font-semibold">{todo.title}</h3>
                    <div className="flex items-center space-x-2 text-sm opacity-80">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(todo.due_date), 'PPP')}</span>
                      {isCurrent && !todo.completed && (
                        <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">
                          Current
                        </span>
                      )}
                      {isOverdue && !todo.completed && (
                        <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold">{todo.points}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
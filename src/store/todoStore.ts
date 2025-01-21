import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { ranks } from '../lib/ranks';

interface Todo {
  id: string;
  title: string;
  points: number;
  due_date: string;
  completed: boolean;
  completed_at: string | null;
}

interface Profile {
  total_points: number;
  current_rank: string;
}

interface TodoStore {
  todos: Todo[];
  profile: Profile | null;
  fetchTodos: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  addTodo: (todo: Partial<Todo>) => Promise<void>;
  completeTodo: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  profile: null,

  fetchTodos: async () => {
    const { data } = await supabase
      .from('todos')
      .select('*')
      .order('due_date', { ascending: true });
    
    if (data) {
      set({ todos: data });
    }
  },

  fetchProfile: async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .single();
    
    if (profile) {
      set({ profile });
    }
  },

  addTodo: async (todo) => {
    const { data } = await supabase
      .from('todos')
      .insert([todo])
      .select()
      .single();
    
    if (data) {
      const todos = get().todos;
      set({ todos: [...todos, data] });
    }
  },

  completeTodo: async (id) => {
    const { data: todo } = await supabase
      .from('todos')
      .update({ 
        completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (todo) {
      const todos = get().todos.map(t => 
        t.id === id ? todo : t
      );
      set({ todos });

      // Update profile points
      const { data: profile } = await supabase
        .from('profiles')
        .update({ 
          total_points: get().profile!.total_points + todo.points,
          current_rank: ranks.findLast(r => r.minPoints <= get().profile!.total_points + todo.points)?.name
        })
        .select()
        .single();

      if (profile) {
        set({ profile });
      }
    }
  }
}));
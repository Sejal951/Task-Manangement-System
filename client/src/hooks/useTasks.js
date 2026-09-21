import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadTasks, addTask, editTask, removeTask, setFilters } from '../store/taskSlice';
import useDebounce from './useDebounce';

export default function useTasks() {
  const dispatch = useDispatch();
  const { items, status, error, filters } = useSelector((state) => state.tasks);
  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    dispatch(loadTasks());
  }, [dispatch]);

  const filteredTasks = useMemo(() => {
    let result = [...items];

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      result = result.filter((task) => task.title.toLowerCase().includes(q));
    }
    if (filters.status) {
      result = result.filter((task) => task.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter((task) => task.priority === filters.priority);
    }

    result.sort((a, b) => {
      const diff = new Date(a.dueDate) - new Date(b.dueDate);
      return filters.sortBy === 'dueDate_desc' ? -diff : diff;
    });

    return result;
  }, [items, debouncedSearch, filters.status, filters.priority, filters.sortBy]);

  const stats = useMemo(
    () => ({
      total: items.length,
      pending: items.filter((t) => t.status === 'pending').length,
      completed: items.filter((t) => t.status === 'completed').length,
      inProgress: items.filter((t) => t.status === 'in-progress').length,
    }),
    [items]
  );

  const updateFilters = useCallback((next) => dispatch(setFilters(next)), [dispatch]);
  const createTask = useCallback((payload) => dispatch(addTask(payload)).unwrap(), [dispatch]);
  const updateTask = useCallback(
    (id, payload) => dispatch(editTask({ id, payload })).unwrap(),
    [dispatch]
  );
  const deleteTask = useCallback((id) => dispatch(removeTask(id)).unwrap(), [dispatch]);
  const refresh = useCallback(() => dispatch(loadTasks()), [dispatch]);

  return {
    tasks: filteredTasks,
    allTasksCount: items.length,
    stats,
    status,
    error,
    filters,
    updateFilters,
    createTask,
    updateTask,
    deleteTask,
    refresh,
  };
}

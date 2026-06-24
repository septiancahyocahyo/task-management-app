interface TaskFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  priorityFilter: string
  onPriorityFilterChange: (priority: string) => void
  sortBy: string
  onSortByChange: (sort: string) => void
  onAddTask: () => void
}

/**
 * TaskFilters — Bar filter, search, sort, dan tombol tambah task.
 */
export default function TaskFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortByChange,
  onAddTask,
}: TaskFiltersProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="search-tasks"
            type="text"
            placeholder="Cari task..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm text-white bg-white/8 border border-white/15 rounded-xl outline-none placeholder-white/30 transition-all duration-300 focus:border-[#4361ee] focus:bg-white/12 focus:ring-2 focus:ring-[#4361ee]/30"
          />
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <select
            id="filter-status"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2.5 text-sm text-white bg-white/8 border border-white/15 rounded-xl outline-none cursor-pointer transition-all duration-300 focus:border-[#4361ee] focus:ring-2 focus:ring-[#4361ee]/30 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.4)%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat pr-7"
          >
            <option value="ALL" className="bg-[#1a1744]">Semua Status</option>
            <option value="TODO" className="bg-[#1a1744]">To Do</option>
            <option value="IN_PROGRESS" className="bg-[#1a1744]">In Progress</option>
            <option value="COMPLETED" className="bg-[#1a1744]">Completed</option>
          </select>

          {/* Priority filter */}
          <select
            id="filter-priority"
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="px-3 py-2.5 text-sm text-white bg-white/8 border border-white/15 rounded-xl outline-none cursor-pointer transition-all duration-300 focus:border-[#4361ee] focus:ring-2 focus:ring-[#4361ee]/30 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.4)%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat pr-7"
          >
            <option value="ALL" className="bg-[#1a1744]">Semua Prioritas</option>
            <option value="LOW" className="bg-[#1a1744]">Low</option>
            <option value="MEDIUM" className="bg-[#1a1744]">Medium</option>
            <option value="HIGH" className="bg-[#1a1744]">High</option>
          </select>

          {/* Sort */}
          <select
            id="sort-tasks"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="px-3 py-2.5 text-sm text-white bg-white/8 border border-white/15 rounded-xl outline-none cursor-pointer transition-all duration-300 focus:border-[#4361ee] focus:ring-2 focus:ring-[#4361ee]/30 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.4)%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat pr-7"
          >
            <option value="newest" className="bg-[#1a1744]">Terbaru</option>
            <option value="oldest" className="bg-[#1a1744]">Terlama</option>
            <option value="dueDate" className="bg-[#1a1744]">Due Date</option>
            <option value="priority" className="bg-[#1a1744]">Prioritas</option>
          </select>

          {/* Tombol Tambah Task */}
          <button
            id="add-task-button"
            onClick={onAddTask}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#4361ee] to-[#7209b7] rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(67,97,238,0.4)] active:translate-y-0 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Tambah Task</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>
      </div>
    </div>
  )
}

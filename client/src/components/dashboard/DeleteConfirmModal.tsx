interface DeleteConfirmModalProps {
  isOpen: boolean
  taskTitle: string
  onClose: () => void
  onConfirm: () => Promise<void>
}

/**
 * DeleteConfirmModal — Dialog konfirmasi sebelum menghapus task.
 * Menampilkan nama task yang akan dihapus dan tombol Batal / Hapus.
 */
export default function DeleteConfirmModal({ isOpen, taskTitle, onClose, onConfirm }: DeleteConfirmModalProps) {
  if (!isOpen) return null

  async function handleDelete() {
    await onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-sm bg-[#1a1744]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl animate-scale-in p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h3 className="text-lg font-bold text-white text-center mb-2">
          Hapus Task?
        </h3>
        <p className="text-sm text-white/50 text-center mb-6 leading-relaxed">
          Task <span className="text-white font-medium">"{taskTitle}"</span> akan dihapus permanen dan tidak bisa dikembalikan.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            id="cancel-delete"
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-white/60 bg-white/5 border border-white/10 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            Batal
          </button>
          <button
            id="confirm-delete"
            type="button"
            onClick={handleDelete}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(239,68,68,0.4)] active:translate-y-0"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

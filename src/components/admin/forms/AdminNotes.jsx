import React, { useState } from "react";
import { auth } from "../../../firebaseConfig";
import { ClipLoader } from "react-spinners";
import { MessageSquare, AlertCircle, Plus } from "lucide-react";

const AdminNotes = ({ requestId, notes = [], onNoteAdded, isDarkMode }) => {
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setLoading(true);
    setError("");

    try {
      const token = await auth.currentUser?.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/requests/${requestId}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ note: newNote }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al añadir la nota");
      }

      const result = await response.json();
      onNoteAdded(result);
      setNewNote("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Lista de notas existentes */}
      <div className="space-y-4">
        {notes.map((note, index) => (
          <div
            key={index}
            className={`relative pl-6 pb-4 ${
              index !== notes.length - 1 ? "border-l" : ""
            } ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <div
              className={`absolute left-0 top-0 w-3 h-3 rounded-full ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            />

            <div
              className={`rounded-xl border ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare
                    className={`h-4 w-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {new Date(note.date).toLocaleString()}
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {note.note}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario para nueva nota */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl ${
              isDarkMode
                ? "bg-red-900/20 text-red-400"
                : "bg-red-50 text-red-600"
            }`}
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Plus
                className={`h-4 w-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <span>Nueva Nota</span>
            </div>
          </label>
          <div
            className={`relative rounded-xl border ${
              isDarkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className={`w-full bg-transparent py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl resize-none ${
                isDarkMode ? "text-gray-200" : "text-gray-900"
              }`}
              rows="4"
              placeholder="Añade una nota administrativa..."
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !newNote.trim()}
          className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-red-600 text-white transition-all duration-200 ${
            loading || !newNote.trim()
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-red-700"
          } flex items-center justify-center gap-2`}
        >
          {loading ? (
            <ClipLoader size={20} color="#ffffff" />
          ) : (
            <>
              <MessageSquare className="h-4 w-4" />
              Añadir Nota
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminNotes;

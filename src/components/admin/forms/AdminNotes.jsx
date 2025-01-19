import React, { useState } from "react";
import { auth } from "../../../firebaseConfig";
import { ClipLoader } from "react-spinners";
import { MessageSquare, AlertCircle } from "lucide-react";

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
    <div className="space-y-4">
      {/* Lista de notas existentes */}
      <div className="space-y-3">
        {notes.map((note, index) => (
          <div
            key={index}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <div className="flex items-start space-x-3">
              <MessageSquare className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-gray-700">{note.note}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(note.date).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario para nueva nota */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 text-red-600 bg-red-50 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label
            className={`block text-sm font-medium  mb-1 ${
              isDarkMode ? "text-gray-100" : "text-gray-700"
            }`}
          >
            Nueva Nota
          </label>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 ${
              isDarkMode ? "bg-gray-600 text-gray-100" : "bg-white text-white"
            }`}
            rows="3"
            placeholder="Añade una nota administrativa..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !newNote.trim()}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <ClipLoader size={20} color="#ffffff" />
          ) : (
            <>
              <MessageSquare className="h-4 w-4 mr-2" />
              Añadir Nota
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminNotes;

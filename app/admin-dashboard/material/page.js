// app/admin-dashboard/material/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import { FadeIn, SlideUp } from '../../../components/Animations';

export default function AdminMaterialPage() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correct: 0,
  });
  const [editId, setEditId] = useState(null);
  const [testDuration, setTestDuration] = useState(30); // menit
  const [submitStatus, setSubmitStatus] = useState('');

  const listRef = useRef(null);

  // Load data dari localStorage
  useEffect(() => {
    const savedQuestions = JSON.parse(localStorage.getItem('coconut_test_questions')) || [];
    const savedDuration = parseInt(localStorage.getItem('coconut_test_duration')) || 30;

    setQuestions(savedQuestions);
    setTestDuration(savedDuration);
  }, []);

  // Inisialisasi SortableJS
  useEffect(() => {
    if (listRef.current && questions.length > 0) {
      const sortable = new Sortable(listRef.current, {
        animation: 150,
        ghostClass: 'opacity-50',
        chosenClass: 'ring-2 ring-blue-500',
        onEnd: (evt) => {
          const newItems = Array.from(listRef.current.children).map((el) => {
            const id = el.getAttribute('data-id');
            return questions.find(q => q.id == id);
          });
          setQuestions(newItems);
          saveToStorage(newItems, testDuration);
        },
      });

      return () => {
        sortable.destroy();
      };
    }
  }, [questions]);

  // Simpan ke localStorage
  const saveToStorage = (qList, duration) => {
    try {
      localStorage.setItem('coconut_test_questions', JSON.stringify(qList));
      localStorage.setItem('coconut_test_duration', duration?.toString() || testDuration.toString());
      setQuestions(qList);
      setSubmitStatus('Data berhasil disimpan!');
      setTimeout(() => setSubmitStatus(''), 5000);
    } catch (error) {
      console.error('Gagal simpan ke localStorage:', error);
      setSubmitStatus('Gagal menyimpan data.');
    }
  };

  // Handle input opsi
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  // Tambah atau Update soal
  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    const { text, options, correct } = newQuestion;

    if (!text.trim()) {
      setSubmitStatus('Pertanyaan tidak boleh kosong.');
      return;
    }
    if (options.some(opt => !opt.trim())) {
      setSubmitStatus('Semua opsi harus diisi.');
      return;
    }

    const question = {
      id: editId || Date.now(),
      text: text.trim(),
      options: options.map(opt => opt.trim()),
      correct: parseInt(correct),
    };

    let updated;
    if (editId) {
      updated = questions.map(q => (q.id === editId ? question : q));
      setEditId(null);
      setSubmitStatus('Soal berhasil diperbarui.');
    } else {
      updated = [question, ...questions];
      setSubmitStatus('Soal berhasil ditambahkan.');
    }

    saveToStorage(updated);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setNewQuestion({
      text: '',
      options: ['', '', '', ''],
      correct: 0,
    });
  };

  // Edit soal
  const handleEdit = (q) => {
    setEditId(q.id);
    setNewQuestion({
      text: q.text,
      options: [...q.options],
      correct: q.correct,
    });
  };

  // Hapus soal
  const handleDelete = (id) => {
    const filtered = questions.filter(q => q.id !== id);
    saveToStorage(filtered);
    setSubmitStatus('Soal dihapus.');
    if (editId === id) resetForm();
  };

  // Ubah durasi tes
  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value);
    setTestDuration(value);
    saveToStorage(questions, value);
    setSubmitStatus(`Durasi tes diubah menjadi ${value} menit.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-900 mb-4">
            📚 Kelola Soal & Tes
          </h1>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Tambah, edit, susun ulang soal, dan atur durasi tes untuk calon anggota.
          </p>
        </FadeIn>

        {submitStatus && (
          <div className="mb-8 p-4 text-sm rounded-lg bg-blue-100 text-blue-800 border border-blue-200 text-center">
            {submitStatus}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form Tambah/Edit Soal */}
          <SlideUp delay={200}>
            <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-blue-900 mb-6">
                {editId ? '✏️ Edit Soal' : '➕ Tambah Soal Baru'}
              </h2>
              <form onSubmit={handleSubmitQuestion} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pertanyaan
                  </label>
                  <textarea
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                    placeholder="Contoh: Apa output dari kode Python berikut? print(2 ** 3 + 1)"
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm resize-none"
                    required
                  />
                </div>

                {newQuestion.options.map((opt, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opsi {idx + 1}
                    </label>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Jawaban opsi ${idx + 1}`}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                      required
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jawaban Benar
                  </label>
                  <select
                    value={newQuestion.correct}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correct: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                  >
                    {newQuestion.options.map((_, idx) => (
                      <option key={idx} value={idx}>
                        Opsi {idx + 1}: {newQuestion.options[idx] || '(kosong)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-full hover:from-green-600 hover:to-emerald-700 transition"
                  >
                    {editId ? 'Perbarui Soal' : 'Tambah Soal'}
                  </button>
                  {editId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(null);
                        resetForm();
                      }}
                      className="px-4 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          </SlideUp>

          {/* Daftar Soal + Drag & Drop */}
          <div className="space-y-6">
            <SlideUp delay={300}>
              <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-blue-900 mb-6">
                  🔄 Susun & Kelola Soal ({questions.length})
                </h2>
                <div
                  ref={listRef}
                  className="space-y-4 max-h-60 overflow-y-auto pr-2"
                >
                  {questions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Belum ada soal.</p>
                  ) : (
                    questions.map((q) => (
                      <div
                        key={q.id}
                        data-id={q.id}
                        className="p-4 bg-white/70 rounded-xl border border-sky-100 cursor-move hover:shadow-md transition group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-semibold text-sky-700">Soal #{questions.findIndex(x => x.id === q.id) + 1}</span>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(q);
                              }}
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(q.id);
                              }}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              ❌
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-800 line-clamp-2">{q.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </SlideUp>

            {/* Pengaturan Durasi Tes */}
            <SlideUp delay={400}>
              <div className="bg-gradient-to-br from-white/90 to-sky-50/90 p-6 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-blue-900 mb-4">⏱️ Durasi Tes</h2>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Durasi (menit)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={testDuration}
                    onChange={handleDurationChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Timer akan otomatis berjalan di halaman tes pengguna.
                  </p>
                </div>
              </div>
            </SlideUp>
          </div>
        </div>
      </div>
    </div>
  );
}
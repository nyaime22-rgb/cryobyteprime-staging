import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay'

interface SubjectRow {
  id: string
  name: string
  code?: string
}

interface QuestionRow {
  id: string
  subject_id: string
  question_text: string
  question_type: QuestionType
  options?: any
  correct_answer?: string
  marks?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  created_by?: string
  created_at?: string
}

export default function QuestionBankPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [subjects, setSubjects] = useState<SubjectRow[]>([])
  const [questions, setQuestions] = useState<QuestionRow[]>([])
  const [loading, setLoading] = useState(false)

  // Filters
  const [filterSubject, setFilterSubject] = useState<string | 'all'>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<string | 'all'>('all')

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [qType, setQType] = useState<QuestionType>('multiple_choice')
  const [qText, setQText] = useState('')
  const [qMarks, setQMarks] = useState<number>(1)
  const [qDifficulty, setQDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [qSubject, setQSubject] = useState<string | null>(null)
  const [qTFAnswer, setQTFAnswer] = useState<'true' | 'false' | null>(null)

  // Options for MCQ
  const [options, setOptions] = useState<{ id: string; text: string; is_correct: boolean }[]>([
    { id: 'a', text: '', is_correct: false },
    { id: 'b', text: '', is_correct: false },
    { id: 'c', text: '', is_correct: false },
    { id: 'd', text: '', is_correct: false },
  ])

  useEffect(() => {
    if (!user) return
    fetchSubjects()
    fetchQuestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    fetchQuestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSubject, filterDifficulty])

  async function fetchSubjects() {
    const { data, error } = await supabase.from('subjects').select('*').order('name')
    if (error) {
      console.error('Error fetching subjects', error)
      return
    }
    setSubjects(data || [])
    if (data && data.length && !qSubject) setQSubject(data[0].id)
  }

  async function fetchQuestions() {
    if (!user) return
    setLoading(true)
    let query: any = supabase.from('questions').select('*').order('created_at', { ascending: false })
    if (filterSubject !== 'all') query = query.eq('subject_id', filterSubject)
    if (filterDifficulty !== 'all') query = query.eq('difficulty', filterDifficulty)

    const { data, error } = await query
    if (error) console.error('Error fetching questions', error)
    setQuestions((data as QuestionRow[]) || [])
    setLoading(false)
  }

  function updateOptionText(id: string, text: string) {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)))
  }

  function toggleCorrect(id: string) {
    setOptions((prev) => prev.map((o) => ({ ...o, is_correct: o.id === id })))
  }

  function addOption() {
    const letter = String.fromCharCode(97 + options.length)
    setOptions((prev) => [...prev, { id: letter, text: '', is_correct: false }])
  }

  function removeOption(id: string) {
    setOptions((prev) => prev.filter((o) => o.id !== id))
  }

  async function handleSave() {
    if (!user) return
    if (!qSubject) {
      alert('Please select a subject')
      return
    }

    const payload: any = {
      subject_id: qSubject,
      question_text: qText,
      question_type: qType,
      marks: qMarks,
      difficulty: qDifficulty,
      created_by: user.id,
    }

    if (qType === 'multiple_choice') {
      payload.options = options.map((o) => ({ id: o.id, text: o.text, is_correct: o.is_correct }))
      const correct = options.find((o) => o.is_correct)
      payload.correct_answer = correct ? correct.id : null
    } else if (qType === 'true_false') {
      payload.correct_answer = qTFAnswer
    }

    const { error } = await supabase.from('questions').insert(payload)
    if (error) {
      console.error('Error inserting question', error)
      alert('Failed to save question')
      return
    }

    // refresh
    setShowModal(false)
    setQText('')
    setOptions([
      { id: 'a', text: '', is_correct: false },
      { id: 'b', text: '', is_correct: false },
      { id: 'c', text: '', is_correct: false },
      { id: 'd', text: '', is_correct: false },
    ])
    setQTFAnswer(null)
    fetchQuestions()
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Question Bank</h1>
        <Button onClick={() => setShowModal(true)}>+ Create Question</Button>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div>
              <Label>Subject</Label>
              <select className="block mt-1" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value as any)}>
                <option value="all">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Difficulty</Label>
              <select className="block mt-1" value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value as any)}>
                <option value="all">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="ml-auto">
              <Button variant="outline" onClick={() => { setFilterSubject('all'); setFilterDifficulty('all') }}>Reset</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {loading && <div>Loading...</div>}
        {!loading && questions.length === 0 && <div className="text-gray-600">No questions found.</div>}
        {questions.map((q) => (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle className="text-lg">{q.question_text}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">Type: {q.question_type} • Difficulty: {q.difficulty || 'N/A'} • Marks: {q.marks || 1}</div>
              {q.options && Array.isArray(q.options) && (
                <ul className="mt-3 list-disc pl-5">
                  {q.options.map((opt: any) => (
                    <li key={opt.id} className={opt.is_correct ? 'font-semibold' : ''}>{opt.id.toUpperCase()}. {opt.text}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Simple modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create Question</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Subject</Label>
                <select className="block mt-1 w-full" value={qSubject ?? ''} onChange={(e) => setQSubject(e.target.value)}>
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Type</Label>
                <select className="block mt-1 w-full" value={qType} onChange={(e) => setQType(e.target.value as QuestionType)}>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True / False</option>
                  <option value="short_answer">Short Answer</option>
                  <option value="essay">Essay</option>
                </select>
              </div>

              <div>
                <Label>Difficulty</Label>
                <select className="block mt-1 w-full" value={qDifficulty} onChange={(e) => setQDifficulty(e.target.value as any)}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <Label>Marks</Label>
                <Input type="number" className="mt-1" value={qMarks} onChange={(e) => setQMarks(Number(e.target.value))} />
              </div>
            </div>

            <div className="mt-4">
              <Label>Question Text</Label>
              <textarea className="w-full mt-1 p-2 border rounded" rows={3} value={qText} onChange={(e) => setQText(e.target.value)} />
            </div>

            {qType === 'multiple_choice' && (
              <div className="mt-4">
                <Label>Options</Label>
                <div className="space-y-2 mt-2">
                  {options.map((opt) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <label className="w-6">{opt.id.toUpperCase()}</label>
                      <Input value={opt.text} onChange={(e) => updateOptionText(opt.id, e.target.value)} />
                      <label className="flex items-center gap-2 ml-2">
                        <input type="radio" name="correct" checked={opt.is_correct} onChange={() => toggleCorrect(opt.id)} />
                        <span className="text-sm">Correct</span>
                      </label>
                      <Button variant="ghost" onClick={() => removeOption(opt.id)}>Remove</Button>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <Button variant="outline" onClick={addOption}>+ Add Option</Button>
                </div>
              </div>
            )}

            {qType === 'true_false' && (
              <div className="mt-4">
                <Label>Correct Answer</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="tf" value="true" checked={qTFAnswer === 'true'} onChange={() => setQTFAnswer('true')} />
                    True
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="tf" value="false" checked={qTFAnswer === 'false'} onChange={() => setQTFAnswer('false')} />
                    False
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Question</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

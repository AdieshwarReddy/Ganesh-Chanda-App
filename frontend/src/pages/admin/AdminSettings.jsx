import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { campaignAPI } from '../../services/api'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AdminSettings() {
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    campaignAPI.getCurrent().then(r => {
      setCampaign(r.data)
      if (r.data) reset(r.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [reset])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      if (campaign?.id) {
        await campaignAPI.update(campaign.id, {
          ...data,
          target_amount: Number(data.target_amount),
          year: Number(data.year),
        })
        toast.success('Campaign settings saved! ✅')
      } else {
        const res = await campaignAPI.create({
          ...data,
          target_amount: Number(data.target_amount),
          year: Number(data.year),
        })
        setCampaign(res.data)
        toast.success('Campaign created! 🎉')
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" text="Loading settings..." />
    </div>
  )

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white">Campaign Settings</h1>
        <p className="text-gray-400 text-sm">Configure the active Ganesh Chanda campaign</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="card">
          <h2 className="text-white font-semibold mb-4">📋 Campaign Info</h2>
          <div className="space-y-4">
            <div>
              <label className="input-label">Campaign Title *</label>
              <input {...register('title', { required: 'Title required' })} className="input-field" placeholder="Ganesh Chanda 2026" />
              {errors.title && <p className="text-crimson-400 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Year *</label>
                <input {...register('year', { required: true, min: 2020, max: 2100 })} type="number" className="input-field" placeholder="2026" />
              </div>
              <div>
                <label className="input-label">Target Amount (₹) *</label>
                <input {...register('target_amount', { required: true, min: 1 })} type="number" className="input-field" placeholder="200000" />
              </div>
            </div>
            <div>
              <label className="input-label">Description</label>
              <textarea {...register('description')} rows={3} className="input-field resize-none" placeholder="Describe the campaign..." />
            </div>
            <div>
              <label className="input-label">Festival Description</label>
              <textarea {...register('festival_description')} rows={3} className="input-field resize-none" placeholder="About the festival..." />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="card">
          <h2 className="text-white font-semibold mb-4">💳 Payment Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="input-label">UPI ID</label>
              <input {...register('upi_id')} className="input-field" placeholder="ganeshchanda@upi" />
            </div>
            <div>
              <label className="input-label">UPI Account Name</label>
              <input {...register('upi_name')} className="input-field" placeholder="Ganesh Utsav Committee" />
            </div>
            <div>
              <label className="input-label">QR Image URL (optional)</label>
              <input {...register('qr_image_url')} className="input-field" placeholder="https://..." type="url" />
            </div>
          </div>
        </div>

        {/* Organizer Contact */}
        <div className="card">
          <h2 className="text-white font-semibold mb-4">📞 Organizer Details</h2>
          <div className="space-y-4">
            <div>
              <label className="input-label">Organizer Name</label>
              <input {...register('organizer_name')} className="input-field" placeholder="Ganesh Utsav Committee" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Contact Phone</label>
                <input {...register('contact_phone')} className="input-field" placeholder="9999999999" type="tel" />
              </div>
              <div>
                <label className="input-label">Contact Email</label>
                <input {...register('contact_email')} className="input-field" placeholder="contact@example.com" type="email" />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
          {saving ? <LoadingSpinner size="sm" /> : <Save size={17} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

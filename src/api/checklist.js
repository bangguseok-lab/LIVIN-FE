import axios from 'axios'

export const deleteMyChecklistItem = async (id, item_id) => {
  const response = await axios.delete(`/api/checklists/${id}/items/${item_id}`)
  return response.data
}

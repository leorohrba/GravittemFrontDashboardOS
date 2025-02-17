import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'

export async function personCheckColaborator(personId: number, userId: number) {
  try {
    const response = await apiCRM({
      method: 'GET',
      url: `/api/CRM/PersonCheckColaborator?personId=${personId}&userId=${userId}`,
    })
    return response
  } catch (error) {
    handleAuthError(error)
  }
}

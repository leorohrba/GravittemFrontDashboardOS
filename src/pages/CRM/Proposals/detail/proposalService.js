import { apiCRM } from '@services/api';
import { handleAuthError } from '@utils';
import { message } from 'antd';

export async function getUserContact(userId, setUserContact) {
  try {
    const response = await apiCRM({
      method: 'GET',
      url: `/api/crm/PersonContact`,
      params: { "personId": userId },
    });
    const { data } = response;
    if (data.isOk) {
      setUserContact(data.personContact.cellPhone);
    } else {
      message.error(data.message);
    }
  } catch (error) {
    handleAuthError(error);
  }
}
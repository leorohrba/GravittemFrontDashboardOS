import { apiCRM, apiFinancial, apiNewContract } from "../utils/api";
import { handleAuthError } from "../utils/utils";

export async function getPersonData(id) {
  try {
    const response = await apiCRM({
      method: "GET",
      url: `/api/CRM/Person?personId=${id}&getPersonDetails=true`,
    });
    const { data } = response;
    return data?.person[0];
  } catch (error) {
    handleAuthError(error);
  }
}

async function sendFinancialPersonData(personBody) {
  try {
    await apiFinancial({
      method: "POST",
      url: `/api/Pessoa/Pessoa`,
      data: personBody,
    });
  } catch (error) {
    handleAuthError(error);
  }
}

export async function sendPersonData(personBody) {
  try {
    const response = await apiNewContract({
      method: "POST",
      url: `/api/Contrato/Pessoa`,
      data: personBody,
    });
    const { data } = response;
    if (data?.isOk || response?.status === 200) {
      sendFinancialPersonData(personBody);
    }
  } catch (error) {
    handleAuthError(error);
  }
}

import { getPersonData, sendPersonData } from './services'

/**
 * JSON do Contato depois de filtrado
 */
interface IFilteredPersonContactBody {
  pessoaContatoGuid: string
  nomeContato: string
  contatoOriginalId: number
  cargo: string | null
  contatoPrincipal: boolean
  documentoContato: string
  emailId: number
  email: string
  phoneId: number
  phone: string | null
  cellphoneId: number
  cellphone: string | null
  siteId: number
  site: string | null
}

/**
 * Prepara o Body para o POST da mensageria
 * @param {Object} personData - Dados da Pessoa que recebe do GET -> api/CRM/Person
 *
 */
function prepareBody(personData) {
  /**
   * Filtra os contatos da pessoa e retorna separado por Guid de contato
   * @returns {Object} JSON de contatos
   */
  function filterPersonContacts() {
    /**
     * Primeiro filtro. Filtra os contatos que podem ser null ou 00000
     *   */
    const filterContacts = personData?.personContacts.map(r => ({
      nomeContato: r?.contactName,
      contatoOriginalId: r?.contactId,
      cargo: null,
      contatoPrincipal: r?.isMain,
      documentoContato: r?.documentCPF,
      emailId:
        r?.tipoContatoEmail === 'Email' || r?.tipoContatoEmail === 'Email2'
          ? r?.emailId
          : 0,
      email: r?.email,
      phoneId:
        r?.tipoContatoPhone === 'Pri' || r?.tipoContatoPhone === 'Res'
          ? r?.phoneId
          : 0,
      phone: r?.phone,
      cellphoneId:
        r?.tipoContatoCellPhone === 'Cel' || r?.tipoContatoCellPhone === 'Cel2'
          ? r?.cellPhoneId
          : 0,
      cellphone: r?.cellPhone,
      siteId: r?.tipoContatoSite === 'Site' ? r?.siteId : 0,
      site: r?.site,
      personContactEmailGuid: r?.personContactEmailGuid,
      personContactPhoneGuid: r?.personContactPhoneGuid,
      personContactCellPhoneGuid: r?.personContactCellPhoneGuid,
      personContactSiteGuid: r?.personContactSiteGuid,
    }))

    const dividedFilteredContacts: IFilteredPersonContactBody =
      filterContacts.map(r => {
        const contactTypeIds = [
          { id: r?.emailId, guid: r?.personContactEmailGuid, type: 'Email' },
          { id: r?.phoneId, guid: r?.personContactPhoneGuid, type: 'Phone' },
          {
            id: r?.cellphoneId,
            guid: r?.personContactCellPhoneGuid,
            type: 'Cellphone',
          },
          { id: r?.siteId, guid: r?.personContactSiteGuid, type: 'Site' },
        ]
        /** Hotfix, precisava terminar rápido. Então gambiarra pra ajeitar o json */
        return contactTypeIds
          .map(
            currentValue =>
              currentValue?.id !== undefined &&
              currentValue?.id !== 0 &&
              currentValue?.guid !== '00000000-0000-0000-0000-000000000000' && {
                pessoaContatoGuid: currentValue?.guid,
                nomeContato: r?.nomeContato,
                contatoOriginalId: r?.contatoOriginalId,
                cargo: null,
                contatoPrincipal: r?.contatoPrincipal,
                documentoContato: r?.documentoContato,
                emailId: currentValue.type === 'Email' ? r?.emailId : 0,
                email: currentValue.type === 'Email' ? r?.email : '',
                phoneId: currentValue.type === 'Phone' ? r?.phoneId : 0,
                phone: currentValue.type === 'Phone' ? r?.phone : null,
                cellphoneId:
                  currentValue.type === 'Cellphone' ? r?.cellphoneId : 0,
                cellphone:
                  currentValue.type === 'Cellphone' ? r?.cellphone : null,
                siteId: currentValue.type === 'Site' ? r?.siteId : 0,
                site: currentValue.type === 'Site' ? r?.site : null,
              },
          )
          .filter(r => r !== undefined)[0]
      })
       // @ts-ignore comment
    return dividedFilteredContacts?.filter(divided => divided !== false)
  }

  const jsonBody = {
    pessoaGuid: personData?.personGuid,
    pessoaOriginalId: personData?.personId,
    tipoPessoa: personData?.personType,
    nome: personData?.name,
    status: personData?.isActive? 1 : 2,
    documentoCPFCNPJ:
      personData?.documentCPF !== null
        ? personData?.documentCPF
        : personData?.documentCNPJ,
    documentoRG: personData?.documentRG,
    inscricaoMunicipal: personData?.documentIM,
    inscricaoEstadual: personData?.documentIE,
    primeiroNome: personData?.shortName,
    pessoaEndereco: personData?.personAddresses.map(r => ({
      pessoaEnderecoGuid: r?.personAddressesGuid,
      enderecoOriginalId: r?.id,
      enderecoLogradouro: r?.name,
      enderecoNumero: r?.number,
      enderecoBairro: r?.neighborhood,
      enderecoCEP: r?.zipCode,
      enderecoComplementox: r?.complement,
      enderecoCidade: r?.cityName,
      enderecoUF: r?.stateAbbreviation,
      enderecoPais: r?.countryName,
      enderecoPadrao: r?.isStandart,
    })),
    pessoaContato: filterPersonContacts(),
  }
  return jsonBody
}

export async function messageCRM(id: number) {
  const personCRM = await getPersonData(id)
  const personBody = personCRM?.personGuid && prepareBody(personCRM)
  personBody && await sendPersonData(personBody)
}

import { act } from '@testing-library/react'
import {
  buildAddressLine1,
  buildAddressLine2,
  customDateTimeFormat,
  customSort,
  fixedZero,
  formatCellPhone,
  formatPhone,
  formatZipCode,
  getAuthToken,
  getPermissions,
  hasPermission,
  removeAccent,
  removeMask,
  removeNonDigit,
  removeNumberFormatting,
  validateByMask,
  zeroesLeft,
} from '@utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import moment from 'moment'
import { localStorageMock } from './testing'

const mock = new MockAdapter(axios)
const userPermissions = [
  {
    code: 'VINA',
    name: 'Visualize',
  },
  {
    code: 'EXPT',
    name: 'ExportExcel',
  },
  {
    code: 'INCL',
    name: 'Include',
  },
  { code: 'ALTE', name: 'Alter' },
  {
    code: 'EXCL',
    name: 'Exclude',
  },
  { code: 'TRAS', name: 'Trash' },
  {
    code: 'RECOV',
    name: 'Recover',
  },
  {
    code: 'INSE',
    name: 'IncludeSearch',
  },
  {
    code: 'ALSE',
    name: 'AlterSearch',
  },
  {
    code: 'EXSE',
    name: 'ExcludeSearch',
  },
]
describe('hasPermission', () => {
  it('Test permission that exists', async () => {
    const hasExcludePermission = hasPermission(userPermissions, 'Exclude')
    expect(hasExcludePermission).toBe(true)
  })
  it('Test permission that not exists', async () => {
    const hasImportPermission = hasPermission(test, 'Import')
    expect(hasImportPermission).toBe(false)
  })
})

describe('customDateTimeFormat', () => {
  it('test with valid date', async () => {
    const date = '2019-10-10'
    const dateFormat = 'DD/MM/YYYY'
    const formatDate = customDateTimeFormat(date, dateFormat)
    expect(formatDate).toBe(moment(date).format(dateFormat))
  })
  it('test with invalid date', async () => {
    const dateFormat = 'DD/MM/YYYY'
    const formatDateWithoutValue = customDateTimeFormat(null, dateFormat)
    expect(formatDateWithoutValue).toBe(null)
  })
})
describe('getPermissions', () => {
  it('test without processId', async () => {
    const permissionsWithoutProcessId = await getPermissions()
    expect(permissionsWithoutProcessId).toStrictEqual([])
  })
  it('test with processId', async () => {
    global.window = Object.create(window)
    const processId = '541'
    Object.defineProperty(window, 'location', {
      value: {
        search: { processId },
      },
    })
    await act(async () => {
      await mock
        .onGet(
          `${process.env.UMI_API_HOST_PERMISSION}/api/permission?processId=${processId}`,
        )
        .reply(200, {
          isOk: true,
          message: '',
          data: userPermissions,
        })
    })
    const permissionsWithProcessId = await getPermissions()

    expect(permissionsWithProcessId.data).toStrictEqual(userPermissions)
  })
})

describe('fixedZero', () => {
  it('should not show zero before number', async () => {
    const result = fixedZero(111)
    expect(result).toBe(111)
  })
  it('should show zero before number', async () => {
    const result = fixedZero(1)
    expect(result).toBe('01')
  })
})

describe('formatTaskDuration', () => {})
describe('formatTaskDateTime', () => {})
describe('customSort', () => {
  it('should sort string', () => {
    const result = customSort('açai', 'baía')
    expect(result).toBe(-1)
  })
  it('should not sort string', () => {
    const result = customSort('barcelona', 'avaí')
    expect(result).toBe(1)
  })
  it('should sort number', () => {
    const result = customSort(1, 2)
    expect(result).toBe(-1)
  })
  it('should not sort number', () => {
    const result = customSort(2, 1)
    expect(result).toBe(1)
  })
  it('should sort date', () => {
    const result = customSort('10/10/2010', '09/10/2010')
    expect(result).toBe(1)
  })
  it('should not sort date', () => {
    const result = customSort('09/10/2010', '10/10/2010')
    expect(result).toBe(-1)
  })
})

describe('removeAccent', () => {
  it('should remove accent from string', () => {
    const result = removeAccent('avaí')
    expect(result).toBe('avai')
  })
})

describe('validateByMask', () => {
  it('should validate number without mask', () => {
    const result = validateByMask('(47)123')
    expect(result).toBe(true)
  })
})

describe('removeNonDigit', () => {
  it('should remove non digit value', () => {
    const result = removeNonDigit('(46)923942-121')
    expect(result).toBe('46923942121')
  })
})

describe('removeMask', () => {
  it('should remove mask', () => {
    const result = removeMask('(46)923942-121')
    expect(result).toBe('46923942121')
  })
  it('should not remove the mask', () => {
    const result = removeMask(null)
    expect(result).toBe(false)
  })
})

describe('formatPhone', () => {
  it('should not format if null', () => {
    const result = formatPhone(null)
    expect(result).toBe(null)
  })
  it('should not format if already formatted', () => {
    const result = formatPhone('(46)1131-31')
    expect(result).toBe('(46)1131-31')
  })
  it('should format with DDD', () => {
    const result = formatPhone('47999159663')
    expect(result).toBe('(47) 99915-9663')
  })
  it('should format without DDD', () => {
    const result = formatPhone('99159663')
    expect(result).toBe('9915-9663')
  })
})

describe('formatZipCode', () => {
  it('should not format if value is not defined', () => {
    const result = formatZipCode(null)
    expect(result).toBe('')
  })
  it('should format', () => {
    const result = formatZipCode('89227012')
    expect(result).toBe('89227-012')
  })
})

describe('zeroesLeft', () => {
  it('should not add zeroes', () => {
    const result = zeroesLeft('010', 3)
    expect(result).toBe('010')
  })
})

describe('formatCellPhone', () => {
  it('should not format if null', () => {
    const result = formatCellPhone(null)
    expect(result).toBe(null)
  })
  it('should not format if already formatted', () => {
    const result = formatCellPhone('(46)1131-31')
    expect(result).toBe('(46)1131-31')
  })
  it('should format with DDD', () => {
    const result = formatCellPhone('47999159663')
    expect(result).toBe('(47) 99915-9663')
  })
  it('should format without DDD', () => {
    const result = formatCellPhone('999159663')
    expect(result).toBe('99915-9663')
  })
})

describe('removeNumberFormatting', () => {
  it('should not format if null', () => {
    const result = removeNumberFormatting(null)
    expect(result).toBe(null)
  })
  it('should not format if empty', () => {
    const result = removeNumberFormatting('')
    expect(result).toBe(null)
  })
  it('should remove number formatting', () => {
    const result = removeNumberFormatting('R$9.999,90')
    expect(result).toBe('9999.90')
  })
})

describe('buildAddressLine1', () => {
  it('test if address was built', () => {
    const result = buildAddressLine1('test', 30, 'test2')
    expect(result).toBe('test, 30 - test2')
  })
})

describe('buildAddressLine2', () => {
  it('test if address was built', () => {
    const result = buildAddressLine2('Joinville', 'SC')
    expect(result).toBe('Joinville - SC')
  })
})

describe('getAuthToken', () => {
  it('token should not be defined', async () => {
    delete global.window
    getAuthToken()
    expect(localStorageMock.getItem('token')).toBe(null)
  })
})

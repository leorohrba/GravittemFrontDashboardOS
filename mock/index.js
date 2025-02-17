export default {
  'GET /api/crm/proposalParcel': (req, res) => {
    setTimeout(() => {
      res.send({
        parcels: [
          {
            number: 1,
            dueDate: '2019-11-08T00:00:00',
            value: 500,
          },
          {
            number: 2,
            dueDate: '2019-12-08T00:00:00',
            value: 500,
          },
          {
            number: 3,
            dueDate: '2020-01-07T00:00:00',
            value: 500,
          },
          {
            number: 4,
            dueDate: '2020-02-06T00:00:00',
            value: 500,
          },
        ],
        totalValue: 2000,
      })
    }, 1000)
  },
  'POST /api/crm/proposalParcel': (req, res) => {
    setTimeout(() => {
      res.send({
        dataSource: [
          {
            key: '0',
            parcelNumber: '1',
            dueDate: '11/10/2019',
            parcelValue: 50.2,
          },
          {
            key: '1',
            parcelNumber: '2',
            dueDate: '12/10/2019',
            parcelValue: 50.3,
          },
        ],
        total: 100,
      })
    }, 1000)
  },
}

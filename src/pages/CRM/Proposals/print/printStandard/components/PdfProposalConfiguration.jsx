const proposalConfiguration = (title, description) => {
  const configData = []
  title?.length > 0 &&
    configData.push({
      margin: [0, 20, 0, 0],
      text: `${title}\n`,
      bold: true,
      fontSize: 14,
      alignment: 'left',
    })
  description?.length > 0 &&
    configData.push({
      style: 'tableExample',
      margin: [0, 10, 0, 0],
      table: {
        widths: ['*'],
        body: [[`${description}`]],
      },
      layout: {
        hLineColor(i, node) {
          return 'gray'
        },

        vLineColor(i, node) {
          return 'gray'
        },

        paddingLeft(i, node) {
          return 10
        },

        paddingRight(i, node) {
          return 10
        },

        paddingTop(i, node) {
          return 10
        },

        paddingBottom(i, node) {
          return 10
        },
      },
    })
  return configData
}
export default proposalConfiguration

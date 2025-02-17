export default function footer(gravittemLogo) {
  return [
    {
      margin: [30, 0, 30, 0],
      columns: [
        {
          image: gravittemLogo,
          width: 80,
        },
        {
          alignment: 'right',
          text: 'www.gravittem.com | (47) 3437-3312',
          fontSize: 10,
          color: 'gray',
        },
      ],
    },
  ]
}

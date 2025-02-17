
// left, top, right, bottom
function footer(abfLogoImgDataUri, abeseLogoImgDataUri)  {
  return [ 
 {
  alignment: 'center',  
  margin: [50, 0, 50, 0],
  stack: [
    {
      columnGap: 10,
      columns: [
        {
          width: '*',
          alignment: 'right',
          stack: [
            {  image: abfLogoImgDataUri,
               width: 50,
            }
          ],
        },
        {
          width: '*',
          alignment: 'left',
          stack: [
            {  image: abeseLogoImgDataUri,
               width: 50,
            }
          ],
        },
      ]
    },
    {
      text:
        'Av. Álvaro Ramos, 2201 São Paulo – SP • (11) 3033-9313 • comercial@atendeportaria.com.br',
      fontSize: 11,
      color: 'black',
    },
  ]
 }]
}

export default footer 


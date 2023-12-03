let URL = 'https://localhost:2809'
export default async function validate (img: string) {
  const response = await fetch(URL, {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({"country": "CO", "image": img})
  }).then(response => response.json())
    .then(jsonResponse => console.log(jsonResponse))
} 

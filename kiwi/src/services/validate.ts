export default async function validate () {
  try {
   const response = await fetch('http://localhost:2809')
   if (!response.ok) {
    throw new Error("Error at get response")
   }
   const data = await response.json()
   console.log('Data: ', data)
   return data;
  } catch(error) {
    console.log("Error at fetch validation api", error)
    return null
  }

} 
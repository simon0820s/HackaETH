import axios from 'axios'

const URL = 'http://localhost:2809'

async function validate (img: string) {
  try {
    const response = await axios.post(
      URL,
      JSON.stringify({ country: 'CO', image: img }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return response
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export { validate }
